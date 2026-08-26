import { useState } from "react";
import { Step, StepLabel, Stepper } from "@mui/material";
import PersonalDetails from "./rental-steps/PersonalDetails";
import RentalSummary from "./rental-steps/RentalSummary";
import RentalReview from "./rental-steps/RentalReview";
import PaymentStep from "./rental-steps/Payment";
import { useSelector } from "react-redux";
import styles from "./RentalFlow.module.css";

const steps = ['איסוף והחזרה', 'מילוי פרטים', 'תשלום', 'סיכום'];

export default function RentalFlow() {
    const [activeStep, setActiveStep] = useState(0);
    const [savedRentalId, setSavedRentalId] = useState(null);

    const handleNext = (rentalId) => {
        if (rentalId) 
            setSavedRentalId(rentalId);
        setActiveStep((prev) => prev + 1);
    }
    
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const renderStep = (step) => {
        if (step === 0) return <RentalReview onNext={handleNext} />
        if (step === 1) return <PersonalDetails onNext={handleNext} onBack={handleBack} />
        if (step === 2) return <PaymentStep onBack={handleBack} onSubmit={handleNext} />
        if (step === 3) return <RentalSummary rentalId={savedRentalId} />
    }

    return (
        <div className={styles.container}>
            <div className={styles.stepperWrapper}>
                <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel
                    sx={{
                        '& .MuiStepIcon-root': { color: '#e0e0e0' }, 
                        '& .MuiStepIcon-root.Mui-active': { color: '#e31b23' }, 
                        '& .MuiStepIcon-root.Mui-completed': { color: '#e31b23' },
                        
                        '& .MuiStepConnector-root': {
                            left: 'calc(50% + 20px)',
                            right: 'calc(-50% + 20px)',
                        },
                    }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>

            <div className={styles.stepContent}>
                {renderStep(activeStep)}
            </div>
        </div>
    );
}