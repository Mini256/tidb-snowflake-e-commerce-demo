import { Box, Typography, Breadcrumbs, Link } from "@mui/material";

export interface BreadcrumbLink {
    label: string;
    href?: string;
    color?: string;
}

export interface PageHeaderProps {
    title: string;
    links: BreadcrumbLink[];
}

export function PageHeader(props: PageHeaderProps) {
    const { title, links = [] } = props;

    links.map((link, index) => {
        if (index === 0) {
            link.color = link.color || 'inherit'
        } else {
            link.color = link.color || 'text.primary'
        }
    });
    
    return <Box>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {title}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '15px' }}>
            {links.map((link) => {
                return <Link key={link.label} underline={ link.href === undefined ? 'hover' : 'none' } color={link.color} href={link.href}>
                    {link.label}
                </Link>
            })}
        </Breadcrumbs>
    </Box>
} 