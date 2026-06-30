// import { CareSyncLogoBadge } from "@/components/shared/brand/animated-caresync-logo-icon";

// export function RouteLoadingScreen() {
//   return (
//     <div className="relative grid min-h-[calc(100vh-9rem)] place-items-center overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-b from-[#0F766E] to-[#14B8A6]">
//       <div className="absolute inset-0" />
//       <div className="relative flex flex-col items-center gap-5 text-center ">
//         <div className="rounded-[2rem] bg-background/45 p-3 shadow-2xl shadow-primary/25 ring-1 ring-primary/20 backdrop-blur-md bg-linear-to-b from-[#0F766E] to-[#14B8A6]">
//           <CareSyncLogoBadge
//             size={128}
//             tone="light"
//             motion="spinning"
//             interactive={false}
//             className="rounded-[1.65rem] bg-primary/85 shadow-primary/25 ring-white/25"
//           />
//         </div>
//         <div className="space-y-1">
//           <p className="text-md font-medium text-white">Loading CareSync</p>
//           <p className="text-sm text-white">Syncing your workspace...</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { CareSyncLogoBadge } from "@/components/shared/brand/animated-caresync-logo-icon";

export function RouteLoadingScreen() {
  return (
    <div className="grid place-items-center h-full">
      {/* Light mode: brand colors, no badge background */}
      <CareSyncLogoBadge
        size={128}
        tone="brand"
        motion="spinning"
        interactive={false}
        noBg
        className="dark:hidden"
      />
      {/* Dark mode: light colors, teal badge background (original look) */}
      <CareSyncLogoBadge
        size={128}
        tone="light"
        motion="spinning"
        interactive={false}
        noBg
        className="hidden dark:block"
      />

    </div>
  );
}
