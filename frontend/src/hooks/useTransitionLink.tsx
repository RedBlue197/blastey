import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const TransitionLink: React.FC<TransitionLinkProps> = ({ href, children, ...props }) => {
  const router = useRouter();

  const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const body = document.querySelector("body");
    body?.classList.add("page-transition");

    await sleep(500); // Delay to allow the transition to take effect

    router.push(href);

    await sleep(500); // Delay to let the effect linger a bit after navigation
    body?.classList.remove("page-transition");
  };

  return (
    <Link onClick={handleTransition} href={href} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
