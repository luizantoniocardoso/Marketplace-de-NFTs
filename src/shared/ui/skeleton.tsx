import { cn } from '@/shared/lib'

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("shimmer rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
