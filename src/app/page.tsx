import Header from "@/components/Header";
import ChatThread from "@/components/ChatThread";
import InputDock from "@/components/InputDock";

export default function Home() {
  return (
    <>
      <Header />
      <div className="wrap">
        <main>
          <ChatThread />
          <InputDock />
        </main>
      </div>
    </>
  );
}
