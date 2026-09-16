import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once at module-evaluation time (not inside a component effect)
// so it's guaranteed to happen before any ScrollTrigger-driven animation is
// set up, regardless of child/parent effect ordering.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
