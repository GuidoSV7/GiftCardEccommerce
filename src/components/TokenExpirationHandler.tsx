import { useTokenExpiration } from '../hooks/useTokenExpiration';

interface TokenExpirationHandlerProps {
    children: React.ReactNode;
}

export const TokenExpirationHandler = ({ children }: TokenExpirationHandlerProps) => {
    useTokenExpiration();
    return <>{children}</>;
};
