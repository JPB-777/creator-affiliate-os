export type ContentType = "blog" | "youtube" | "social" | "email" | "podcast";

export interface DisclosureOptions {
  contentType: ContentType;
  networks: string[];
}

export function generateDisclosure(options: DisclosureOptions): string {
  const networkList =
    options.networks.length > 0
      ? options.networks.join(", ")
      : "various affiliate programs";

  const templates: Record<ContentType, string> = {
    blog: `Disclosure: This post contains affiliate links to ${networkList}. If you click through and make a purchase, I may earn a commission at no additional cost to you. All opinions are my own.`,
    youtube: `Some links in this description are affiliate links (${networkList}). If you purchase through these links, I may earn a small commission at no extra cost to you. I only recommend products I personally use and believe in.`,
    social: `#ad Affiliate links used (${networkList}). I may earn a commission if you purchase through my links. #affiliate`,
    email: `This email contains affiliate links to ${networkList}. I may receive a commission if you make a purchase through these links, at no additional cost to you.`,
    podcast: `Some of the links mentioned in this episode are affiliate links (${networkList}). If you use them, I may earn a small commission. This helps support the show at no cost to you.`,
  };

  return templates[options.contentType];
}

export const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "blog", label: "Blog Post" },
  { value: "youtube", label: "YouTube Video" },
  { value: "social", label: "Social Media" },
  { value: "email", label: "Email/Newsletter" },
  { value: "podcast", label: "Podcast" },
];
