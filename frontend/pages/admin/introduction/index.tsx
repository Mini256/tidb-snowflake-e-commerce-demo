import { Grid, Typography } from "@mui/material";
import DashboardLayout from "../../../src/DashboardLayout/DashboardLayout";
import { PageHeader } from "../../../src/DashboardLayout/PageHeader";

export default function IntroductionPage() {
    return (
        <DashboardLayout>
            <Grid container spacing={3}>
                <Typography variant="h3">Introduction</Typography>
            </Grid>
        </DashboardLayout>
    )
}