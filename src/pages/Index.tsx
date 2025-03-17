import { useState, useEffect } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import ChatHistory from "@/components/ChatHistory";
import ChatInterface from "@/components/ChatInterface";
import WorkflowPanel from "@/components/WorkflowPanel";
import ExtensionStatusIndicator from "@/components/ExtensionStatusIndicator";
import VersionDisplay from "@/components/VersionDisplay";
import SeedDataButton from "@/components/SeedDataButton";
import { useChats } from "@/hooks/useChats";
import { useToast } from "@/components/ui/use-toast";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { chats, exampleChats, isLoading, createChat, deleteChat } = useChats();
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setSelectedConversationId(idFromUrl);
    }
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (!isLoading && chats.length > 0 && !selectedConversationId) {
      setSelectedConversationId(chats[0].id);
    } else if (!isLoading && chats.length === 0 && exampleChats.length > 0 && !selectedConversationId) {
      setSelectedConversationId(exampleChats[0].id);
    }
  }, [chats, exampleChats, isLoading, selectedConversationId]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleNewConversation = async () => {
    toast({
      title: "Creating new chat",
      description: "Please provide a title for your new workflow chat",
    });
  };

  const handleCreateChat = async (title: string) => {
    try {
      const newChatId = await createChat(title);
      setSelectedConversationId(newChatId);
      setIsMobileSidebarOpen(false);
      
      const url = new URL(window.location.href);
      url.searchParams.set('id', newChatId);
      window.history.pushState({}, '', url);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsMobileSidebarOpen(false);
    
    const url = new URL(window.location.href);
    url.searchParams.set('id', conversationId);
    window.history.pushState({}, '', url);
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
    
    if (selectedConversationId === chatId) {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url);
      
      setSelectedConversationId("");
    }
  };

  const handleSendMessage = (message: string) => {
    console.log('Message sent:', message);
  };

  return (
    <div className="min-h-screen dark:bg-gray-950 bg-gray-50 transition-colors duration-300 overflow-hidden">
      <div className="h-screen flex flex-col">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-medium">WorkflowChat</h1>
              <VersionDisplay />
            </div>
            <ExtensionStatusIndicator />
          </div>
          <div className="flex items-center gap-2">
            <SeedDataButton />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
              U
            </div>
          </div>
        </header>
        <div className="flex-1 flex overflow-hidden">
          <div 
            className={`
              fixed md:relative inset-0 md:inset-auto z-30 md:z-auto w-full md:w-72 lg:w-80 transition-transform duration-300 ease-in-out
              ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
          >
            <div className="h-full glass-panel-strong md:rounded-none">
              <ChatHistory
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                chats={chats}
                exampleChats={exampleChats}
                isLoading={isLoading}
                onCreateChat={handleCreateChat}
                onDeleteChat={handleDeleteChat}
              />
            </div>
            {isMobileSidebarOpen && (
              <div 
                className="md:hidden fixed inset-0 bg-black/40 z-[-1]"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}
          </div>
          <div className="flex-1 flex items-stretch p-4 gap-4 overflow-hidden">
            <ResizablePanelGroup 
              direction="horizontal"
              className="w-full rounded-lg"
            >
              <ResizablePanel 
                defaultSize={50} 
                minSize={30}
              >
                <div className="h-full glass-panel">
                  {selectedConversationId ? (
                    <ChatInterface
                      conversationId={selectedConversationId}
                      onSendMessage={handleSendMessage}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <p className="text-lg mb-2">Select or create a chat to get started</p>
                        <p className="text-sm">You can create a new chat from the sidebar.</p>
                      </div>
                    </div>
                  )}
                </div>
              </ResizablePanel>
              <ResizableHandle className="w-2 bg-transparent" withHandle />
              <ResizablePanel 
                defaultSize={50} 
                minSize={25}
                className="hidden md:block"
              >
                <div className="h-full glass-panel">
                  <WorkflowPanel onRunWorkflow={handleRunWorkflow} showRunButton={true} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

const handleRunWorkflow = () => {
  console.log("Running workflow...");
};

export default Index;
