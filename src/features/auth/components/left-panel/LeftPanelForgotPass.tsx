import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { LeftPanelShell } from "./LeftPanelShell";

const reassurances = [
  "Reset link expires in 15 minutes",
  "Your account data stays encrypted",
  "No third-party access to your account",
  "Enable two-factor authentication after recovery",
];

export function LeftPanelForgotPass() {
  return (
    <LeftPanelShell>
      <div className="mt-28 max-w-xl">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70"
        >
          Account recovery
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-4 text-4xl font-semibold leading-tight"
        >
          Locked out? We'll get you back in.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mt-4 max-w-md text-base leading-7 text-white/75"
        >
          Enter your email and we'll send a secure link to reset your password in seconds.
        </motion.p>

        <div className="mt-10 grid gap-3">
          {reassurances.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
              className="flex items-center gap-3 text-sm text-white/90"
            >
              <span className="grid size-6 place-items-center rounded-full border border-white/25 bg-white/10">
                <Check className="size-3.5" />
              </span>
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </LeftPanelShell>
  );
}
