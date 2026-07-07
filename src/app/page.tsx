import Header from "@/components/Header";
import ChatThread from "@/components/ChatThread";
import InputDock from "@/components/InputDock";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="wrap flex-1 flex flex-col min-h-0">
          <main className="flex-1 flex flex-col min-w-0 h-full">
            <ChatThread />
            <InputDock />
          </main>
        </div>
      </div>
    </div>
  );
}
