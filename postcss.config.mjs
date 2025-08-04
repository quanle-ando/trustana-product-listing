const config = {
  plugins: [
    process.env.NODE_ENV === "test"
      ? (await import("@tailwindcss/postcss")).default()
      : "@tailwindcss/postcss",
  ],
};

export default config;
