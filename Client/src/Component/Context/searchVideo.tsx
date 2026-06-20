import { createContext, useContext, useState, type ReactNode } from "react";
 
type SearchVideoContextType = {
  isSearchVideo: string;
  setSearchValuebyHook: (value: string) => void;
};
 
const SearchVideoContext = createContext<SearchVideoContextType | undefined>(undefined);
 
export const SearchVideoProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchVideo, setIsSearchVideo] = useState("");
  const setSearchValuebyHook = (value: string) => {
    setIsSearchVideo(value);
  }
  return (
    <SearchVideoContext.Provider value={{ isSearchVideo, setSearchValuebyHook }}>
      {children}
    </SearchVideoContext.Provider>
  );
};
 
export const useSearchVideo = () => {
  const ctx = useContext(SearchVideoContext);
  if (!ctx) throw new Error("useSearchVideo must be used within SearchVideoProvider");
  return ctx;
};