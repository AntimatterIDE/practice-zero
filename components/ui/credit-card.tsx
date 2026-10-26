"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface CreditCardProps {
  /** Card number (will be formatted with spaces) */
  cardNumber?: string;

  /** Cardholder name */
  cardholderName?: string;

  /** Expiration date (MM/YY format) */
  expirationDate?: string;

  /** CVV code (3 digits) */
  cvv?: string;

  /** Card company logo URL (optional) */
  cardLogo?: string;

  /** Chip image URL (optional) */
  chipImage?: string;

  /** Background gradient (CSS gradient string) */
  background?: string;

  /** Scale factor for card size (maintains aspect ratio) */
  scale?: number;

  /** Intensity multiplier for rotation effect (0-2) */
  rotationIntensity?: number;

  /** Intensity multiplier for parallax layer movement (0-2) */
  parallaxIntensity?: number;

  /** Scale on hover (1.0 = no scale) */
  scaleOnHover?: number;

  /** Enable/disable the shine gradient effect */
  showShine?: boolean;

  /** Enable/disable the shadow effect */
  showShadow?: boolean;

  /** Border radius of the card */
  borderRadius?: number;

  /** Text color for card details */
  textColor?: string;

  /** Enable text shadow on card details (not labels) */
  hasTextShadow?: boolean;

  /** Show action buttons (eye to toggle visibility, copy to clipboard) */
  showActionButtons?: boolean;

  /** Additional class name for wrapper */
  className?: string;

  /** Additional class name for the card element */
  cardClassName?: string;

  /** Additional class name for action buttons */
  buttonsClassName?: string;

  /** Replace the front face. Tilt, shine, and flip stay. */
  front?: React.ReactNode;

  /** Replace the back face. */
  back?: React.ReactNode;

  /** Stretch to the parent width and keep the card ratio. */
  fluid?: boolean;

  /** Accessible name for the flip control. */
  ariaLabel?: string;
}

const formatCardNumber = (number: string) => {
  const cleaned = number.replace(/\s/g, "");
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(" ");
};

const maskCardNumber = (number: string) => {
  const cleaned = number.replace(/\s/g, "");
  const chunks = cleaned.match(/.{1,4}/g) || [];
  if (chunks.length === 0) return number;

  return chunks.map((chunk, idx) => (idx === 0 ? chunk : "****")).join(" ");
};

const maskExpirationDate = () => {
  return "**/**";
};

const BASE_WIDTH = 320;
const BASE_HEIGHT = 200;

export const CreditCard: React.FC<CreditCardProps> = ({
  cardNumber = "1234 5678 9012 3456",
  cardholderName = "JOHN DOE",
  expirationDate = "12/25",
  cvv = "123",
  cardLogo,
  chipImage,
  background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  scale = 1.2,
  rotationIntensity = 1,
  parallaxIntensity = 1,
  scaleOnHover = 1.05,
  showShine = true,
  showShadow = true,
  borderRadius = 16,
  textColor = "#ffffff",
  hasTextShadow = true,
  showActionButtons = false,
  className,
  cardClassName,
  buttonsClassName,
  front,
  back,
  fluid = false,
  ariaLabel,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const backgroundLayerRef = useRef<HTMLDivElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [box, setBox] = useState({ w: BASE_WIDTH * scale, h: BASE_HEIGHT * scale });
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!fluid || !wrapperRef.current) return;
    const el = wrapperRef.current;
    const measure = () => {
      const w = el.clientWidth;
      if (w < 8) return;
      const h = Math.round(w * (BASE_HEIGHT / BASE_WIDTH));
      setBox((prev) => (Math.abs(prev.w - w) < 0.5 && prev.h === h ? prev : { w, h }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fluid]);

  const formattedCardNumber = formatCardNumber(cardNumber);
  const displayCardNumber = isDetailsVisible ? formattedCardNumber : maskCardNumber(cardNumber);
  const displayExpirationDate = isDetailsVisible ? expirationDate : maskExpirationDate();

  const width = fluid ? box.w : BASE_WIDTH * scale;
  const height = fluid ? box.h : BASE_HEIGHT * scale;
  const effectiveScale = width / BASE_WIDTH;

  const calculateRelativePosition = useCallback((clientX: number, clientY: number) => {
    if (!wrapperRef.current) return null;

    const bounds = wrapperRef.current.getBoundingClientRect();
    const cardW = wrapperRef.current.clientWidth;
    const cardH = wrapperRef.current.clientHeight;

    const centerOffsetX = 0.5 - (clientX - bounds.left) / cardW;
    const centerOffsetY = 0.5 - (clientY - bounds.top) / cardH;

    const deltaX = clientX - bounds.left - cardW / 2;
    const deltaY = clientY - bounds.top - cardH / 2;

    return {
      normalizedX: centerOffsetX,
      normalizedY: centerOffsetY,
      deltaX,
      deltaY,
      relativeY: clientY - bounds.top,
      width: cardW,
      height: cardH,
    };
  }, []);

  const handleInteraction = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (reduceMotion || !wrapperRef.current || !cardContainerRef.current) return;

      const isTouchEvent = "touches" in e;
      const pointerX = isTouchEvent ? e.touches[0].pageX : e.pageX;
      const pointerY = isTouchEvent ? e.touches[0].pageY : e.pageY;

      const position = calculateRelativePosition(pointerX, pointerY);
      if (!position) return;

      const { normalizedX, normalizedY, deltaX, deltaY, relativeY, width: cardW, height: cardH } = position;

      const responsiveFactor = BASE_WIDTH / cardW;

      const baseRotationX = 0.08 * responsiveFactor * rotationIntensity;
      const baseRotationY = 0.06 * responsiveFactor * rotationIntensity;

      const tiltY = (normalizedX - deltaX) * baseRotationY;
      const tiltX = (deltaY - normalizedY) * baseRotationX;

      let transformStyles = isFlipped
        ? `rotateY(${180 + tiltY}deg) rotateX(${tiltX}deg)`
        : `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      if (isActive) {
        transformStyles += ` scale3d(${scaleOnHover}, ${scaleOnHover}, ${scaleOnHover})`;
      }

      cardContainerRef.current.style.transform = transformStyles;

      const angleRad = Math.atan2(deltaY, deltaX);
      let angleDeg = (angleRad * 180) / Math.PI - 90;
      if (angleDeg < 0) angleDeg += 360;

      if (glowRef.current) {
        const glowAlpha = (relativeY / cardH) * 0.35 + 0.05;
        glowRef.current.style.background = `linear-gradient(${angleDeg}deg, rgba(255,255,255,${glowAlpha}) 0%, rgba(255,255,255,0) 75%)`;

        const glowShiftX = normalizedX * 2 - 0.15;
        const glowShiftY = normalizedY * 2 - 0.15;
        const glowRotation = isFlipped ? " rotateY(180deg)" : "";
        glowRef.current.style.transform = `translateX(${glowShiftX}px) translateY(${glowShiftY}px)${glowRotation}`;
      }

      if (!isFlipped) {
        const parallaxMultiplier = 2.8 * parallaxIntensity;

        if (backgroundLayerRef.current) {
          const bgParallaxX = (normalizedX * 2 * (0 * parallaxMultiplier)) / responsiveFactor;
          const bgParallaxY = (normalizedY * 2 * (0 * parallaxMultiplier)) / responsiveFactor;
          backgroundLayerRef.current.style.transform = `translate3d(${bgParallaxX}px, ${bgParallaxY}px, 0)`;
        }

        if (contentLayerRef.current) {
          const contentParallaxX = (normalizedX * 2 * (1 * parallaxMultiplier)) / responsiveFactor;
          const contentParallaxY = (normalizedY * 2 * (1 * parallaxMultiplier)) / responsiveFactor;
          contentLayerRef.current.style.transform = `translate3d(${contentParallaxX}px, ${contentParallaxY}px, 0)`;
        }
      }
    },
    [isFlipped, isActive, calculateRelativePosition, rotationIntensity, parallaxIntensity, scaleOnHover, reduceMotion],
  );

  const handleActivate = useCallback(() => {
    setIsActive(true);
  }, []);

  const resetTransforms = useCallback(() => {
    setIsActive(false);
    if (cardContainerRef.current) {
      cardContainerRef.current.style.transform = isFlipped ? "rotateY(180deg)" : "";
    }
    if (glowRef.current) {
      glowRef.current.style.cssText = "";
    }
    if (backgroundLayerRef.current) {
      backgroundLayerRef.current.style.transform = "";
    }
    if (contentLayerRef.current) {
      contentLayerRef.current.style.transform = "";
    }
  }, [isFlipped]);

  const handleTouchBegin = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleTouchComplete = useCallback(() => {
    resetTransforms();
  }, [resetTransforms]);

  const viewportPerspective = Math.max(width * 3, 600);

  const handleCopyCardNumber = useCallback(() => {
    if (isDetailsVisible) {
      navigator.clipboard.writeText(cardNumber);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [cardNumber, isDetailsVisible]);

  const handleCardClick = useCallback(() => {
    setIsFlipping(true);
    setIsFlipped((prev) => !prev);
    setTimeout(() => setIsFlipping(false), reduceMotion ? 0 : 600);
  }, [reduceMotion]);

  const fontSize = {
    cardNumber: `${20 * effectiveScale}px`,
    label: `${10 * effectiveScale}px`,
    text: `${12 * effectiveScale}px`,
  };

  const spacing = {
    padding: `${24 * effectiveScale}px`,
    gap: `${12 * effectiveScale}px`,
    chipWidth: `${40 * effectiveScale}px`,
    chipHeight: `${32 * effectiveScale}px`,
    logoHeight: `${32 * effectiveScale}px`,
  };

  return (
    <motion.div
      className={cn("inline-flex flex-col items-center gap-4", className)}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <div
        ref={wrapperRef}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel ?? `${cardholderName} card`}
        aria-pressed={isFlipped}
        className={cn(
          "relative inline-block transform-3d cursor-pointer touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e4a38]",
          fluid && "w-full",
        )}
        style={{
          width: fluid ? "100%" : `${width}px`,
          height: `${height}px`,
          borderRadius: `${borderRadius}px`,
          transform: `perspective(${viewportPerspective}px)`,
        }}
        onMouseMove={handleInteraction}
        onMouseEnter={handleActivate}
        onMouseLeave={resetTransforms}
        onTouchStart={handleTouchBegin}
        onTouchMove={handleInteraction}
        onTouchEnd={handleTouchComplete}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
          }
        }}
      >
        <motion.div
          ref={cardContainerRef}
          className={cn(
            "transform-3d relative h-full w-full transition-transform duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform",
            isActive && "active-state",
            cardClassName,
          )}
          style={{
            borderRadius: `${borderRadius}px`,
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            ease: "easeInOut",
          }}
        >
          {showShadow && (
            <motion.div
              className={cn(
                "absolute top-[5%] left-[5%] h-[90%] w-[90%] bg-transparent transition-all duration-200 ease-out",
                isActive
                  ? "shadow-[0_45px_100px_rgba(14,21,47,0.4),0_16px_40px_rgba(14,21,47,0.4)]"
                  : "shadow-[0_8px_30px_rgba(14,21,47,0.6)]",
              )}
              style={{
                borderRadius: `${borderRadius}px`,
              }}
              animate={{
                opacity: isFlipping ? 0 : 1,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            />
          )}

          <div
            className="backface-hidden transform-3d absolute inset-0 h-full w-full overflow-hidden"
            style={{
              borderRadius: `${borderRadius}px`,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div
              ref={backgroundLayerRef}
              className="absolute inset-0 h-full w-full"
              style={{
                background,
                borderRadius: `${borderRadius}px`,
              }}
            />

            <div
              ref={contentLayerRef}
              aria-hidden={front ? isFlipped : undefined}
              className={cn("absolute inset-0 h-full w-full", !front && "flex flex-col justify-between")}
              style={{
                borderRadius: `${borderRadius}px`,
                color: textColor,
                padding: front ? 0 : spacing.padding,
              }}
            >
              {front ?? (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center" style={{ gap: spacing.gap }}>
                      {chipImage && (
                        <img
                          src={chipImage}
                          alt="Card chip"
                          className="object-contain"
                          style={{
                            width: spacing.chipWidth,
                            height: spacing.chipHeight,
                          }}
                        />
                      )}
                    </div>
                    {cardLogo && (
                      <img
                        src={cardLogo}
                        alt="Card logo"
                        className="object-contain"
                        style={{
                          height: spacing.logoHeight,
                        }}
                      />
                    )}
                  </div>

                  <div
                    className="flex w-full justify-between font-mono font-medium"
                    style={{
                      fontSize: fontSize.cardNumber,
                      textShadow: hasTextShadow ? "0 2px 4px rgba(0, 0, 0, 0.3)" : "none",
                    }}
                  >
                    {displayCardNumber.split(" ").map((group, groupIdx) => (
                      <span key={groupIdx} className="inline-flex tracking-wider">
                        {group.split("").map((char, charIdx) => (
                          <motion.span
                            key={`${groupIdx}-${charIdx}-${char}-${isDetailsVisible}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              duration: 0.2,
                              delay: (groupIdx * 4 + charIdx) * 0.02,
                              ease: "easeOut",
                            }}
                            className="inline-block"
                          >
                            {char}
                          </motion.span>
                        ))}
                      </span>
                    ))}
                  </div>

                  <div
                    className="flex items-end justify-between"
                    style={{
                      fontSize: fontSize.text,
                    }}
                  >
                    <div className="flex flex-col">
                      <span
                        className="opacity-70"
                        style={{
                          fontSize: fontSize.label,
                          marginBottom: `${4 * effectiveScale}px`,
                        }}
                      >
                        CARDHOLDER
                      </span>
                      <span
                        className="font-medium tracking-wide uppercase"
                        style={{
                          textShadow: hasTextShadow ? "0 2px 4px rgba(0, 0, 0, 0.3)" : "none",
                        }}
                      >
                        {cardholderName}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className="opacity-70"
                        style={{
                          fontSize: fontSize.label,
                          marginBottom: `${4 * effectiveScale}px`,
                        }}
                      >
                        EXPIRES
                      </span>
                      <span
                        className="inline-flex"
                        style={{
                          textShadow: hasTextShadow ? "0 2px 4px rgba(0, 0, 0, 0.3)" : "none",
                        }}
                      >
                        {displayExpirationDate.split("").map((char, idx) => (
                          <motion.span
                            key={`exp-${idx}-${char}-${isDetailsVisible}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              duration: 0.2,
                              delay: idx * 0.03,
                              ease: "easeOut",
                            }}
                            className="inline-block"
                          >
                            {char}
                          </motion.span>
                        ))}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className="backface-hidden transform-3d absolute inset-0 h-full w-full overflow-hidden"
            style={{
              borderRadius: `${borderRadius}px`,
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div
              className="absolute inset-0 h-full w-full"
              style={{
                background,
                borderRadius: `${borderRadius}px`,
              }}
            />

            {back ? (
              <div
                aria-hidden={!isFlipped}
                className="absolute inset-0 h-full w-full"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                {back}
              </div>
            ) : (
              <div
                className="absolute inset-0 flex h-full w-full flex-col"
                style={{
                  borderRadius: `${borderRadius}px`,
                  color: textColor,
                }}
              >
                <div
                  className="w-full bg-black"
                  style={{
                    height: `${40 * effectiveScale}px`,
                    marginTop: `${20 * effectiveScale}px`,
                  }}
                />

                <div
                  className="flex flex-1 items-center justify-start"
                  style={{
                    paddingLeft: spacing.padding,
                  }}
                >
                  <div
                    className="flex flex-col items-start justify-center bg-white"
                    style={{
                      width: `${120 * effectiveScale}px`,
                      height: `${40 * effectiveScale}px`,
                      paddingLeft: `${12 * effectiveScale}px`,
                      borderRadius: `${4 * effectiveScale}px`,
                    }}
                  >
                    <span
                      className="text-gray-500"
                      style={{
                        fontSize: fontSize.label,
                        marginBottom: `${2 * effectiveScale}px`,
                      }}
                    >
                      CVV
                    </span>
                    <span
                      className="font-mono font-semibold tracking-wider text-gray-900"
                      style={{
                        fontSize: fontSize.text,
                      }}
                    >
                      {isDetailsVisible ? cvv : "***"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showShine && !isFlipped && (
            <div
              className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
              style={{
                borderRadius: `${borderRadius}px`,
              }}
            >
              <div
                ref={glowRef}
                className="absolute inset-0 h-full w-full"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,.25) 0%, rgba(255,255,255,0) 60%)",
                }}
              />
            </div>
          )}
        </motion.div>
      </div>

      {showActionButtons && (
        <div className={cn("flex gap-2", buttonsClassName)}>
          <button
            onClick={() => setIsDetailsVisible(!isDetailsVisible)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
            title={isDetailsVisible ? "Hide details" : "Show details"}
          >
            {isDetailsVisible ? <Eye className="h-5 w-5 text-gray-700" /> : <EyeOff className="h-5 w-5 text-gray-700" />}
          </button>
          <button
            onClick={handleCopyCardNumber}
            disabled={!isDetailsVisible}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200",
              isDetailsVisible ? "cursor-pointer hover:shadow-lg" : "cursor-not-allowed opacity-50",
            )}
            title={isDetailsVisible ? (copySuccess ? "Copied!" : "Copy card number") : "Show details to copy"}
          >
            {copySuccess ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-gray-700" />}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CreditCard;
