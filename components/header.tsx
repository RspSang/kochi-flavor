import Head from "next/head";

interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps) {
  return (
    <div>
      <Head>
        <title>Kochi Flavor | {title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    </div>
  );
}

export default Header;
