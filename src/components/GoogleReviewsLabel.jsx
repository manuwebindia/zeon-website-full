function GoogleWordmark({ className = "" }) {
  return (
    <span
      className={`inline-flex font-semibold tracking-tight ${className}`}
      aria-hidden="true"
    >
      <span style={{ color: "#4285F4" }}>G</span>
      <span style={{ color: "#EA4335" }}>o</span>
      <span style={{ color: "#FBBC05" }}>o</span>
      <span style={{ color: "#4285F4" }}>g</span>
      <span style={{ color: "#34A853" }}>l</span>
      <span style={{ color: "#EA4335" }}>e</span>
    </span>
  );
}

export default function GoogleReviewsLabel({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[0.95rem] ${className}`}
      aria-label="Google Reviews"
    >
      <GoogleWordmark className="text-[0.95rem]" />
      <span className="text-body font-medium">Reviews</span>
    </span>
  );
}
