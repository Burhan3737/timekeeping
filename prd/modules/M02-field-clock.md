# Module 02 — Field Clock

Dependencies:
Authentication
Employees

## View
Field Mode Screen
- Employee ID input
- Clock in button
- Clock out button
- Recent activity

## Logic
clockIn(employeeId)
clockOut(employeeId)
validateShift()
detectDuplicateClock()

## API
POST /time-entry/clock-in
POST /time-entry/clock-out