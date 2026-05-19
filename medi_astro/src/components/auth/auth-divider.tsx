import { Separator } from '@/components/ui/separator';

export function AuthDivider() {
  return (
    <div className="my-8 flex w-full items-center gap-4 overflow-hidden">
      <Separator className="w-auto flex-1" />
      <span className="shrink-0 text-sm text-muted-foreground">o</span>
      <Separator className="w-auto flex-1" />
    </div>
  );
}
