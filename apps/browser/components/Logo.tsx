import { clsx } from "clsx";
import { memo } from "react";
import colors from "tailwindcss/colors";

type LogoType = {
  wordmark?: boolean;
  className?: string;
  logoClassName?: string;
  chatAvatar?: boolean;
};

const Logo = ({
  wordmark = true,
  className,
  logoClassName,
  chatAvatar,
}: LogoType) => {
  return (
    <>
      <div className={clsx("flex", className)}>
  <img src="/logo192.png" alt="Vanguard" className={clsx("h-8", logoClassName)} />
        {wordmark && (
          <h1
            className={clsx(
              "text-2xl font-bold text-white",
              chatAvatar ? "ml-2" : "ml-4"
            )}
          >
            Vanguard
          </h1>
        )}
      </div>
    </>
  );
};

export default memo(Logo);
