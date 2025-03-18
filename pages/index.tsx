import type { NextPage } from 'next';
import Head from 'next/head';
import Landing from '../components/landing';

const LandingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>RVCE Activity Points | Login</title>
        <meta name="description" content="RVCE Activity Points tracking system" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <main>
        <Landing />
      </main>
    </>
  );
};

export default LandingPage;