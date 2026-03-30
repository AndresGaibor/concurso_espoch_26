-- Schema para tablas de usuarios y roles
-- Ejecutar en Supabase Dashboard > SQL Editor

-- Tabla de Roles
CREATE TABLE IF NOT EXISTS ROLES (
    IdRol SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar rol admin por defecto
INSERT INTO ROLES (Nombre, Descripcion) 
VALUES ('ADMIN', 'Administrador del sistema')
ON CONFLICT (Nombre) DO NOTHING;

-- Insertar rol usuario por defecto
INSERT INTO ROLES (Nombre, Descripcion) 
VALUES ('USUARIO', 'Usuario regular del sistema')
ON CONFLICT (Nombre) DO NOTHING;

-- Tabla de Usuarios (vinculada a Supabase Auth)
CREATE TABLE IF NOT EXISTS USUARIOS (
    SupabaseUserId UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    IdRol INTEGER NOT NULL DEFAULT 2 REFERENCES ROLES(IdRol),
    Nombre VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON USUARIOS(Email);

-- Índice para búsqueda por rol
CREATE INDEX IF NOT EXISTS idx_usuarios_idrol ON USUARIOS(IdRol);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON USUARIOS;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON USUARIOS
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS: Por defecto, solo admins pueden ver todos los usuarios
ALTER TABLE USUARIOS ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver su propio registro
CREATE POLICY "Usuarios ven su propio registro"
ON USUARIOS FOR SELECT
USING (auth.uid() = SupabaseUserId);

-- Política: Solo admins pueden ver todos los registros
CREATE POLICY "Admins ven todos los registros"
ON USUARIOS FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM USUARIOS u
        JOIN ROLES r ON u.IdRol = r.IdRol
        WHERE u.SupabaseUserId = auth.uid() 
        AND r.Nombre = 'ADMIN'
    )
);

-- Política: Solo admins pueden insertar
CREATE POLICY "Solo admins pueden crear usuarios"
ON USUARIOS FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM USUARIOS u
        JOIN ROLES r ON u.IdRol = r.IdRol
        WHERE u.SupabaseUserId = auth.uid() 
        AND r.Nombre = 'ADMIN'
    )
);

-- Política: Solo admins pueden actualizar
CREATE POLICY "Solo admins pueden actualizar usuarios"
ON USUARIOS FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM USUARIOS u
        JOIN ROLES r ON u.IdRol = r.IdRol
        WHERE u.SupabaseUserId = auth.uid() 
        AND r.Nombre = 'ADMIN'
    )
);

-- Política: Solo admins pueden eliminar
CREATE POLICY "Solo admins pueden eliminar usuarios"
ON USUARIOS FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM USUARIOS u
        JOIN ROLES r ON u.IdRol = r.IdRol
        WHERE u.SupabaseUserId = auth.uid() 
        AND r.Nombre = 'ADMIN'
    )
);
