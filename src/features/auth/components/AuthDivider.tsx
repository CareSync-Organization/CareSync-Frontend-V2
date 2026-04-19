type AuthDividerProps = {
  children: string;
};

export function AuthDivider({ children }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="h-px flex-1 bg-border" />
      <span className="shrink-0">{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
