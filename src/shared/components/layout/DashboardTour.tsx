import { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import type { EventData, Step } from 'react-joyride';

interface DashboardTourProps {
  role: 'student' | 'tutor' | 'admin';
}

export const DashboardTour = ({ role }: DashboardTourProps) => {
  const [run, setRun] = useState(false);
  const [filteredSteps, setFilteredSteps] = useState<Step[]>([]);

  // Define steps for each role
  const stepsByRole: Record<string, Step[]> = {
    student: [
      {
        target: '.tour-dashboard-header',
        content: 'Welcome to your personalized student dashboard! Let us show you around.',
        skipBeacon: true,
      },
      {
        target: '.tour-my-courses',
        content: 'Access all your enrolled courses, pick up where you left off, and track your progress.',
      },
      {
        target: '.tour-study-materials',
        content: 'Find all your study resources like PDFs, video recordings, and quizzes here.',
      },
      {
        target: '.tour-upcoming-classes',
        content: 'Here you will see your upcoming schedule. Never miss a session!',
      },
      {
        target: '.tour-doubts-cta',
        content: 'Stuck on a problem? Use the Doubts portal to ask questions and get help from tutors.',
      }
    ],
    tutor: [
      {
        target: '.tour-dashboard-header',
        content: 'Welcome to the Tutor portal! Here is a quick tour to get you started.',
        skipBeacon: true,
      },
      {
        target: '.tour-stats',
        content: 'Keep an eye on your key metrics: total students, active courses, and pending doubts.',
      },
      {
        target: '.tour-start-class',
        content: 'Ready to teach? Click here to instantly start a live broadcast for any of your batches.',
      },
      {
        target: '.tour-recent-sessions',
        content: 'Check your recent past sessions and class history here.',
      }
    ],
    admin: [
      {
        target: '.tour-dashboard-header',
        content: 'Welcome to the Admin control center! Let’s review your tools.',
        skipBeacon: true,
      },
      {
        target: '.tour-stats',
        content: 'Platform-wide metrics at a glance: total revenue, active users, and more.',
      },
      {
        target: '.tour-enrollments',
        content: 'Review and approve new student enrollment requests here.',
      },
      {
        target: '.tour-recent-students',
        content: 'Quickly view recent student sign-ups and their assigned courses.',
      },
      {
        target: '.tour-batches',
        content: 'Monitor active batches and track overall student progress.',
      }
    ]
  };

  useEffect(() => {
    // Check if the user has seen the tour before
    const tourKey = `has_seen_tour_${role}_v2`; // Increment version to force re-run
    const hasSeenTour = localStorage.getItem(tourKey);

    if (!hasSeenTour) {
      // Small delay to ensure all UI elements have rendered
      const timer = setTimeout(() => {
        // Failsafe: Only include steps where the target actually exists in the DOM
        const rawSteps = stepsByRole[role] || [];
        const validSteps = rawSteps.filter((step) => {
          // step.target is guaranteed to be a string in our config
          return document.querySelector(step.target as string) !== null;
        });

        if (validSteps.length > 0) {
          setFilteredSteps(validSteps);
          setRun(true);
        }
      }, 1200); // slightly longer delay for mobile paints
      return () => clearTimeout(timer);
    }
  }, [role]);

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      // Save to localStorage so they don't see it again
      localStorage.setItem(`has_seen_tour_${role}_v2`, 'true');
    }
  };

  return (
    <Joyride
      steps={filteredSteps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleJoyrideCallback}
        options={{
        primaryColor: '#f97316',
        backgroundColor: '#111',
        textColor: '#fff',
        arrowColor: '#111',
        overlayColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000,
        showProgress: true,
        buttons: ['back', 'close', 'primary', 'skip'],
      }}
      styles={{
        tooltipContainer: {
          textAlign: 'left',
          borderRadius: '16px',
        },
        buttonPrimary: {
          backgroundColor: '#f97316',
          borderRadius: '8px',
          fontWeight: 'bold',
        },
        buttonBack: {
          color: '#a3a3a3',
          marginRight: '10px',
        },
        buttonSkip: {
          color: '#a3a3a3',
        }
      }}
    />
  );
};
