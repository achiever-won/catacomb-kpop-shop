import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className={styles.stepIndicator}>
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const stepClass = [
          styles.step,
          isActive ? styles.active : '',
          isCompleted ? styles.completed : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={index} className={styles.stepWrapper}>
            <div className={stepClass}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <span className={styles.stepLabel}>{label}</span>
            </div>
            {index < steps.length - 1 && (
              <span
                className={`${styles.connector}${isCompleted ? ` ${styles.completed}` : ''}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
