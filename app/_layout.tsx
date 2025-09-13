import { Stack } from "expo-router";
import { View } from "react-native";
import ThemeProvider from "../context/ThemeContext"
import i18n from "../service/i18n";
import { I18nextProvider } from "react-i18next";

export default function Layout() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </I18nextProvider>

  );
}