
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import ChatInterface from "./components/ChatInterface";
import { Index } from "./pages/Index";
import { NotFound } from "./pages/NotFound";
import { ConversationPage } from "./pages/ConversationPage";
import { WorkflowPage } from "./pages/WorkflowPage";
import { useChats } from "./hooks/useChats";

function App() {
  const { chats, exampleChats, systemExampleChats, isLoading, createChat, deleteChat, duplicateChat } = useChats();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Use the first chat as the selected conversation when chats are loaded
  useEffect(() => {
    if (!selectedConversationId && chats.length > 0 && !isLoading) {
      setSelectedConversationId(chats[0].id);
    }
  }, [chats, isLoading, selectedConversationId]);

  const handleCreateChat = async (title: string) => {
    const chatId = await createChat(title);
    setSelectedConversationId(chatId);
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
    // If the deleted chat was selected, select another one
    if (selectedConversationId === chatId) {
      const remainingChats = [...chats, ...exampleChats].filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setSelectedConversationId(remainingChats[0].id);
      } else {
        setSelectedConversationId(null);
      }
    }
  };

  const handleDuplicateChat = async (chatId: string) => {
    const newChatId = await duplicateChat(chatId);
    if (newChatId) {
      setSelectedConversationId(newChatId);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Index
              selectedConversationId={selectedConversationId || ""}
              onSelectConversation={setSelectedConversationId}
              onNewConversation={() => setSelectedConversationId(null)}
              chats={chats}
              exampleChats={exampleChats}
              systemExampleChats={systemExampleChats}
              isLoading={isLoading}
              onCreateChat={handleCreateChat}
              onDeleteChat={handleDeleteChat}
              onDuplicateChat={handleDuplicateChat}
            />
          }
        />
        <Route path="/chat/:id" element={<ConversationPage />} />
        <Route path="/workflow/:id" element={<WorkflowPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
