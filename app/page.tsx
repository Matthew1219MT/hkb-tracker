import Image from "next/image";
import Foundation from "./components/Foundation";
import I18nProvider from './i18nProvider';

export default function Home() {
  return (
    <I18nProvider>
      <Foundation/>
    </I18nProvider>
  );
}
