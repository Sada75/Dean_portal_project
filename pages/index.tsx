import React from 'react';
import Head from 'next/head';
import StudentCard from '../components/stu';
import { motion } from 'framer-motion';

export default function StudentPage() {
  // Sample initial events data
  const initialEvents = [
    { id: '1', name: 'event1', points: 50 },
    { id: '2', name: 'Technical Workshop', points: 30 },
    { id: '3', name: 'Hackathon', points: 75 }
  ];

  return (
    <>
      <Head>
        <title>Student Activity Points</title>
        <meta name="description" content="Track and manage student activity points" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="student-page">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-header"
        >
          <h1>Student Activity Points</h1>
          <p>Track your participation and achievements</p>
        </motion.div>

        <StudentCard initialEvents={initialEvents} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="actions-container"
        >
          <button className="action-btn primary">Save Profile</button>
          <button className="action-btn secondary">Export Report</button>
        </motion.div>

        <div className="page-footer">
          <p>College Activity Points System &copy; 2025</p>
        </div>
      </div>
    </>
  );
}