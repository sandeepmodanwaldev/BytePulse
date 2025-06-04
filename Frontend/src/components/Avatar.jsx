export default function Avatar({ username, src, size = "md" }) {
  const sizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const url =
    src || `https://api.dicebear.com/6.x/thumbs/svg?seed=${username || "user"}`;

  return <img src={url} alt="avatar" className={`rounded-full ${sizeClass}`} />;
}
