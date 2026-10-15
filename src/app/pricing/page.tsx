import { redirect } from "next/navigation";

export default function PricingPage() {
  redirect("/quote?service=end-of-lease-cleaning");
}
