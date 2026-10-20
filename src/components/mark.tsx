// Two link halves with a short bar between them
export function Mark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 6.5H5.5a3.5 3.5 0 0 0 0 7H8" />
      <path d="M12 6.5h2.5a3.5 3.5 0 0 1 0 7H12" />
      <path d="M7 10h6" />
    </svg>
  );
}
