import dynamic from "next/dynamic";
import React from "react";

const NoSRRWrapper = (props: { children: React.ReactNode }) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default dynamic(() => Promise.resolve(NoSRRWrapper), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-40 w-full bg-zinc-800 rounded-lg" />
  ),
});
