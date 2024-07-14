"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
export default function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            className="flex flex-row flex-wrap justify-end items-center gap-4"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="bg-[#FF5D5D] px-8 py-2.5 font-bold rounded-3xl text-slate-900 text-base flex justify-end items-center"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    className="bg-[#000] px-4 py-2 rounded text-white"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="flex flex-row flex-wrap justify-end items-center gap-4">
                  <button
                    onClick={openChainModal}
                    className="flex flex-row justify-center items-center gap-2 border border-[#FF5D5D] text-[#FF5D5D] font-medium px-2 xl:px-4 py-1.5 rounded-full"
                    type="button"
                  >
                    {chain.name}
                  </button>
                  <button
                    className="px-4 xl:px-6 py-2 text-slate-800 rounded-full shadow-sm cursor-pointer bg-[#FF5D5D] font-medium flex flex-row justify-center items-center"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {account.ensName ? account.ensName : account.displayName}
                    {account.displayBalance ? (
                      <span className="hidden xl:block ml-1">
                        ({account.displayBalance})
                      </span>
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
