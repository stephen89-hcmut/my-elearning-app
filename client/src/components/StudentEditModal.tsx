import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { Student } from '@/types';

export interface StudentEditFormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enrollmentDate: string;
  bankName?: string;
  paymentAccount?: string;
}

interface StudentEditModalProps {
  open: boolean;
  student?: Student;
  loading?: boolean;
  onSubmit: (values: StudentEditFormValues) => void;
  onCancel: () => void;
}

const StudentEditModal: React.FC<StudentEditModalProps> = ({ open, student, loading, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState<StudentEditFormValues>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    enrollmentDate: '',
    bankName: '',
    paymentAccount: '',
  });

  useEffect(() => {
    if (open) {
      setFormValues({
        username: student?.user?.username || '',
        email: student?.user?.email || '',
        firstName: student?.user?.firstName || '',
        lastName: student?.user?.lastName || '',
        enrollmentDate: student?.enrollmentDate ? new Date(student.enrollmentDate).toISOString().slice(0, 10) : '',
        bankName: student?.user?.bankName || '',
        paymentAccount: student?.user?.paymentAccount || '',
      });
    }
  }, [open, student]);

  const isEmailValid = useMemo(() => /.+@.+\..+/.test(formValues.email), [formValues.email]);
  const isValid = useMemo(
    () =>
      Boolean(
        formValues.username &&
        formValues.email &&
        formValues.firstName &&
        formValues.lastName &&
        formValues.enrollmentDate &&
        isEmailValid,
      ),
    [formValues, isEmailValid],
  );

  const handleChange = (field: keyof StudentEditFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Edit Student</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Make changes to the student details below.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Username"
              value={formValues.username}
              onChange={handleChange('username')}
              required
              fullWidth
              placeholder="sv_username"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              value={formValues.email}
              onChange={handleChange('email')}
              required
              fullWidth
              placeholder="an.nguyen123@hcmut.edu.vn"
              error={!!formValues.email && !isEmailValid}
              helperText={!!formValues.email && !isEmailValid ? 'Email is not valid' : ' '}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              value={formValues.firstName}
              onChange={handleChange('firstName')}
              required
              fullWidth
              placeholder="Nguyen"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              value={formValues.lastName}
              onChange={handleChange('lastName')}
              required
              fullWidth
              placeholder="Van A"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Enrollment Date"
              type="date"
              value={formValues.enrollmentDate}
              onChange={handleChange('enrollmentDate')}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Bank Name"
              value={formValues.bankName}
              onChange={handleChange('bankName')}
              fullWidth
              placeholder="Vietcombank, TPBank, etc."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Payment Account"
              value={formValues.paymentAccount}
              onChange={handleChange('paymentAccount')}
              fullWidth
              placeholder="Account number or phone number"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Stack direction="row" spacing={1.5} sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} variant="outlined">Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!isValid || loading}
            sx={{
              minWidth: 140,
              '&.Mui-disabled': {
                backgroundColor: '#d9d9d9',
                color: '#ffffff',
                cursor: 'not-allowed',
              },
            }}
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default StudentEditModal;
