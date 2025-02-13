"use client";

import { SocketProvider } from "./SocketProvider";
import RecoilContextProvider from "./RecoilContextProvider";
import ClientLayout from "./ClientLayout";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <RecoilContextProvider>
        <ClientLayout>{children}</ClientLayout>
      </RecoilContextProvider>
    </SocketProvider>
  );
}