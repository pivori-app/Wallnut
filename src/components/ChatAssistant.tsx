import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User, Loader2, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getInvestmentAssistantResponse } from '../services/geminiService';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Bonjour ! Comment puis-je vous aider avec votre projet de portage immobilier Wallnut aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    const newMessages: { role: 'user' | 'assistant', content: string }[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await getInvestmentAssistantResponse(newMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      const errorMessage = error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')
        ? "⚠️ Erreur API : La clé d'API Gemini n'est pas valide ou n'a pas été configurée. Veuillez vérifier votre clé dans le panneau **Settings > Secrets** en haut à droite."
        : "Désolé, j'ai rencontré une erreur de serveur. Vérifiez votre configuration.";
        
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-secondary text-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] border-2 border-white dark:border-[#121826]"
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] glass rounded-3xl z-50 flex flex-col overflow-hidden border border-white/20 shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold">Assistant Wallnut</h3>
                <p className="text-[10px] text-secondary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                  En ligne • IA V4.1
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                    msg.role === 'user' ? "bg-white dark:bg-white/10" : "bg-primary text-white"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-app-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none px-4" 
                      : "bg-black/5 dark:bg-white/5 rounded-tl-none px-4 markdown-body-chat"
                  )}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => {
                            const isInternal = props.href?.startsWith('/');
                            if (isInternal) {
                              return <Link to={props.href!} className="text-secondary font-bold underline underline-offset-2 hover:text-secondary/80 focus:outline-none">{props.children}</Link>;
                            }
                            return <a target="_blank" rel="noopener noreferrer" className="text-secondary font-bold underline underline-offset-2 hover:text-secondary/80 focus:outline-none" {...props} />;
                          },
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin opacity-40" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-black/5 dark:border-white/5 flex gap-2">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-app-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="p-3 bg-secondary text-primary rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
