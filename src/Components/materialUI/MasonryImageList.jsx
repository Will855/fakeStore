import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useTheme } from '@mui/material/styles';

/**
 * Componente para mostrar imágenes en diseño Masonry responsivo
 * @returns {JSX.Element} Grid de imágenes con disposición adaptativa
 */
export default function MasonryImageList() {
    const theme = useTheme();
    
    // Configuración responsiva de columnas
    const responsiveColumns = {
        [theme.breakpoints.up('xs')]: 1,  // 1 columna en móviles (<600px)
        [theme.breakpoints.up('sm')]: 2,  // 2 columnas en tablets (≥600px)
        [theme.breakpoints.up('md')]: 3   // 3 columnas en desktop (≥900px)
    };

    return (
        <Box sx={{
            width: '100%',
            height: 'auto',
            padding: { xs: '0 10px', sm: '0 20px' } // Padding responsivo
        }}>
            <ImageList
                variant="masonry"
                cols={3} // Columnas base
                gap={8}  // Espacio entre imágenes
                sx={{
                    // Configuración responsiva de columnas
                    [theme.breakpoints.up('xs')]: { cols: 1 },
                    [theme.breakpoints.up('sm')]: { cols: 2 },
                    [theme.breakpoints.up('md')]: { cols: 3 },
                }}
            >
                {itemData.map((item) => (
                    <ResponsiveImageItem 
                        key={item.img}
                        img={item.img}
                        title={item.title}
                    />
                ))}
            </ImageList>
        </Box>
    );
}

/**
 * Componente individual para imágenes responsivas
 * @param {Object} props - Propiedades del componente
 * @param {string} props.img - URL de la imagen
 * @param {string} props.title - Texto alternativo
 * @returns {JSX.Element} Item de imagen optimizado
 */
const ResponsiveImageItem = ({ img, title }) => {
    // Parámetros de optimización de imagen
    const imageParams = {
        base: '?w=248&fit=crop&auto=format',
        retina: '?w=248&fit=crop&auto=format&dpr=2 2x'
    };

    return (
        <ImageListItem>
            <img
                srcSet={`${img}${imageParams.retina}`}
                src={`${img}${imageParams.base}`}
                alt={title}
                loading="lazy"
                style={{
                    width: '100%',        // Ancho completo del contenedor
                    height: 'auto',       // Altura automática
                    minHeight: '200px',   // Altura mínima para móviles
                    borderRadius: '8px', // Bordes redondeados
                    boxShadow: theme.shadows[2] // Sombra suave
                }}
            />
        </ImageListItem>
    );
};

// Validación de propiedades
ResponsiveImageItem.propTypes = {
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

// Opcional: Exportar datos para uso en pruebas
export { itemData };