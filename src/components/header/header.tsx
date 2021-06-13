import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { Children, cloneElement, PropsWithChildren, ReactElement } from "react";
import classes from "./header.module.css";

export default function Header() {
  return (
    <header>
      <h1>護石ツールズ</h1>
      <nav>
        <NavLink href="/talismans">
          <a className={classes.pageLink}>護石一覧</a>
        </NavLink>
        <span> / </span>
        <NavLink href="/scanner">
          <a className={classes.pageLink}>スキャナー</a>
        </NavLink>
        <span> / </span>
        <NavLink href="/interop">
          <a className={classes.pageLink}>インポート＆エクスポート</a>
        </NavLink>
        <span> / </span>
        <NavLink href="/about">
          <a className={classes.pageLink}>About</a>
        </NavLink>
      </nav>
    </header>
  );
}

type NavLinkProps = PropsWithChildren<LinkProps> & {
  activeClassName?: string;
};

export function NavLink({
  children,
  activeClassName = classes.active,
  ...props
}: NavLinkProps) {
  const { asPath } = useRouter();
  const child = Children.only(children) as ReactElement;
  const childClassName = child.props.className || "";
  const isActive = asPath === props.href || asPath === props.as;
  const className = clsx(childClassName, { [activeClassName]: isActive });

  return (
    <Link {...props}>
      {cloneElement(child, {
        className: className || null,
      })}
    </Link>
  );
}
