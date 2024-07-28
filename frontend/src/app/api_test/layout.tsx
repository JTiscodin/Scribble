import SocketContextProvider from "@/contexts/Socket";

export default function TestLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <SocketContextProvider>
        {children}
      </SocketContextProvider>
    );
  }