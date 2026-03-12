# Workforce Time Management System

## Purpose
A system for tracking employee work hours across field and office environments.

Primary use cases:
- Field clock-in / clock-out
- Manual time entry
- Timesheet approval
- Time corrections
- Overtime tracking
- Time-off requests
- Employee management
- Scheduling
- Reporting

Primary roles:
1. Employee
2. Admin / Manager

## Architecture Principle

Separate layers:

VIEW LAYER
- UI rendering
- Forms
- Tables
- Inputs
- Layouts

LOGIC LAYER
- Business rules
- State management
- API interactions
- Validation

Claude Code should implement logic independently from UI.

## Core Domain Objects
User
Employee
Shift
TimeEntry
Timesheet
OvertimeRecord
TimeCorrection
TimeOffRequest
Alert
ChargeCode
JobTitle