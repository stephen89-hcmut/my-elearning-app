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
import { Instructor } from '@/types';

export interface InstructorEditFormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bankName?: string;
  paymentAccount?: string;
  specialty?: string;
  bio?: string;
}

interface InstructorEditModalProps {
  open: boolean;
  instructor?: Instructor;
  loading?: boolean;
  onSubmit: (values: InstructorEditFormValues) => void;
  onCancel: () => void;
}

const InstructorEditModal: React.FC<InstructorEditModalProps> = ({ open, instructor, loading, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState<InstructorEditFormValues>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    bankName: '',
    paymentAccount: '',
    specialty: '',
    bio: '',
  });

  useEffect(() => {
    if (open) {
      setFormValues({
        username: instructor?.user?.username || '',
        email: instructor?.user?.email || '',
        firstName: instructor?.user?.firstName || '',
        lastName: instructor?.user?.lastName || '',
        phone: instructor?.phone || '',
        bankName: instructor?.user?.bankName || '',
        paymentAccount: instructor?.user?.paymentAccount || '',
        specialty: instructor?.specialty || '',
        bio: instructor?.bio || '',
      });
    }
  }, [open, instructor]);

  const isEmailValid = useMemo(() => /.+@.+\..+/.test(formValues.email), [formValues.email]);
  const isValid = useMemo(
    () =>
      Boolean(
        formValues.username &&
        formValues.email &&
        formValues.firstName &&
        formValues.lastName &&
        isEmailValid,
      ),
    [formValues, isEmailValid],
  );

  const handleChange = (field: keyof InstructorEditFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Edit Instructor</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Make changes to the instructor details below.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Username"
              value={formValues.username}
              onChange={handleChange('username')}
              required
              fullWidth
              placeholder="gv_username"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              value={formValues.email}
              onChange={handleChange('email')}
              required
              fullWidth
              placeholder="gv@example.com"
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
              label="Phone"
              value={formValues.phone}
              onChange={handleChange('phone')}
              fullWidth
              placeholder="0123xxxxxx"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Specialty"
              value={formValues.specialty}
              onChange={handleChange('specialty')}
              fullWidth
              placeholder="Mathematics, Physics, ..."
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
          <Grid item xs={12} md={6}>
            <TextField
              label="Payment Account"
              value={formValues.paymentAccount}
              onChange={handleChange('paymentAccount')}
              fullWidth
              placeholder="Account number or phone number"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bio"
              value={formValues.bio}
              onChange={handleChange('bio')}
              fullWidth
              multiline
              minRows={3}
              placeholder="Short introduction about the instructor"
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

export default InstructorEditModal;
