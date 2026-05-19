# NestJS Backend para Camellio — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un backend REST en NestJS que reemplace todos los datos mockeados del frontend de Camellio, cubriendo auth, trabajos, ofertas, mensajes, reseñas y perfiles.

**Architecture:** API REST con NestJS + TypeORM + PostgreSQL. Auth con JWT. Chat con polling REST (WebSockets como fase 2). El frontend reemplaza sus Contexts (localStorage + mock data) por llamadas HTTP.

**Tech Stack:** NestJS, TypeORM, PostgreSQL, JWT (passport-jwt), bcrypt, class-validator, class-transformer.

---

## 1. ANÁLISIS COMPLETO DEL FRONTEND

### 1.1 Pantallas existentes

| Ruta | Descripción | Datos que consume |
|------|-------------|-------------------|
| `/` | Redirect a `/landing` | — |
| `/landing` | Landing general | Estático (landingContent.ts) |
| `/landing/empleado` | Landing para trabajadores | Estático |
| `/landing/empleador` | Landing para empleadores | Estático |
| `/bienvenido` | Welcome post-registro | Usuario autenticado |
| `/como-funciona` | Explicación del producto | Estático |
| `/login` | Login con email+password | `users[]` mock |
| `/registro` | Selector tipo de cuenta | — |
| `/registro/trabajador` | Onboarding trabajador | Crea User+WorkerProfile |
| `/registro/cliente` | Onboarding empleador | Crea User+EmployerProfile |
| `/explorar` | Lista de trabajadores con búsqueda+filtro categoría | `workers[]` mock |
| `/perfil/[id]` | Perfil público de worker o employer | `getUserById(id)` mock |
| `/trabajos/[id]` | Detalle de trabajo + ofertas | `jobs[]`, `offers[]`, `getUserById()` mock |
| `/publicar` | Crear trabajo (3 pasos) | Escribe a `JobContext` |
| `/dashboard/worker` | Panel del trabajador | `jobs[]`, `offers[]`, `reviews[]` + datos hardcodeados |
| `/dashboard/worker/applications` | Todas las postulaciones | `offers[]` del worker |
| `/dashboard/employer` | Panel del empleador | `jobs[]`, `offers[]`, `reviews[]` + datos hardcodeados |
| `/dashboard/employer/applicants` | Todos los postulantes | `offers[]` + `getUserById()` |
| `/mensajes` | Selector de conversación | — |
| `/mensajes/[chatId]` | Chat individual | `chats[]`, `messages[]` mock |

---

### 1.2 Archivos que contienen datos falsos (mock)

| Archivo | Qué contiene | Estado |
|---------|-------------|--------|
| `src/data/users.ts` | 10 usuarios (6 workers, 4 employers) | 100% mock |
| `src/data/jobs.ts` | 10 trabajos | 100% mock |
| `src/data/offers.ts` | 10 propuestas | 100% mock |
| `src/data/chats.ts` | 4 conversaciones | 100% mock |
| `src/data/messages.ts` | 16 mensajes | 100% mock |
| `src/data/reviews.ts` | 5 reseñas | 100% mock |
| `src/data/categories.ts` | 8 categorías | Estático — puede quedarse en frontend |
| `src/data/copy.ts` | Textos UI | Estático — no es datos de negocio |
| `src/data/landingContent.ts` | Contenido landing | Estático — no es datos de negocio |

**Datos hardcodeados DENTRO de componentes** (no en `/data/`):

| Archivo | Qué está hardcodeado |
|---------|---------------------|
| `src/app/dashboard/worker/page.tsx:39-58` | `WORKER_DEMO`, `activeJobs`, earnings (`$340.000`, `$304.000`) |
| `src/app/dashboard/employer/page.tsx:36-159` | `employer`, `applicants`, `activeHires`, `reviewsGiven`, `activityFeed` |

---

### 1.3 Entidades que necesita el backend

#### User
```typescript
{
  id: string;            // UUID
  role: "worker" | "employer";
  name: string;
  email: string;         // único
  passwordHash: string;
  phone?: string;
  avatar?: string;       // URL
  location: string;
  bio?: string;
  createdAt: Date;
  workerProfile?: WorkerProfile;    // relación 1:1
  employerProfile?: EmployerProfile; // relación 1:1
}
```

#### WorkerProfile
```typescript
{
  id: string;
  userId: string;
  category: string;      // slug: "plomeria", "electricidad", etc.
  skills: string[];      // array de strings
  hourlyRate: number;    // COP
  rating: number;        // 0.0–5.0 (calculado)
  reviewCount: number;   // calculado
  completedJobs: number; // calculado
  verified: boolean;
  available: boolean;
  portfolio: PortfolioItem[];
}
```

#### EmployerProfile
```typescript
{
  id: string;
  userId: string;
  companyName?: string;
  jobsPosted: number;    // calculado
  verified: boolean;
}
```

#### Job
```typescript
{
  id: string;
  employerId: string;
  title: string;
  description: string;
  category: string;      // slug
  location: string;
  budget: { min: number; max: number };
  urgency: "flexible" | "this_week" | "urgent";
  status: "draft" | "open" | "in_progress" | "completed" | "cancelled";
  offerCount: number;    // calculado
  acceptedOfferId?: string;
  images: string[];      // URLs
  createdAt: Date;
  updatedAt: Date;
}
```

#### Offer
```typescript
{
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  proposedPrice: number;
  estimatedDuration: string;
  message: string;
  status: "pending" | "negotiating" | "accepted" | "rejected" | "withdrawn";
  counterOfferPrice?: number;
  counterOfferNote?: string;
  negotiationRound: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Chat
```typescript
{
  id: string;
  jobId: string;
  offerId?: string;
  participantIds: [string, string];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Record<string, number>;
  createdAt: Date;
}
```

#### Message
```typescript
{
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: "text" | "offer_update" | "system";
  readBy: string[];
  createdAt: Date;
}
```

#### Review
```typescript
{
  id: string;
  jobId: string;
  offerId: string;
  authorId: string;
  targetId: string;
  rating: number;        // 1–5
  comment: string;
  createdAt: Date;
}
```

---

### 1.4 Endpoints REST que necesita el frontend

#### Auth
```
POST   /auth/register/worker          Registro de trabajador
POST   /auth/register/employer        Registro de empleador
POST   /auth/login                    Login → { token, user }
GET    /auth/me                       Usuario autenticado (requiere JWT)
```

#### Users & Perfiles
```
GET    /users/:id                     Perfil público (worker o employer)
PUT    /users/:id                     Actualizar perfil propio
GET    /workers                       Lista de workers con filtros
                                      ?category=&q=&location=
```

#### Jobs
```
GET    /jobs                          Lista con filtros
                                      ?status=&category=&employerId=
POST   /jobs                          Crear trabajo (empleador)
GET    /jobs/:id                      Detalle + offers embebidas
PATCH  /jobs/:id/status               Cambiar status { status }
```

#### Offers
```
GET    /offers                        Lista filtrada ?jobId=&workerId=
POST   /offers                        Crear propuesta (trabajador)
POST   /offers/:id/accept             Aceptar
POST   /offers/:id/reject             Rechazar
POST   /offers/:id/withdraw           Retirar
POST   /offers/:id/counter            Contraoferta { price, note }
```

#### Chats
```
GET    /chats                         Chats del usuario autenticado
GET    /chats/:id                     Detalle del chat
POST   /chats                         Crear chat { jobId, participantIds, offerId? }
PATCH  /chats/:id/read                Marcar como leído
```

#### Messages
```
GET    /messages?chatId=              Mensajes paginados de un chat
POST   /messages                      Enviar mensaje { chatId, content, type? }
```

#### Reviews
```
GET    /reviews                       Lista filtrada ?workerId=&jobId=&authorId=
POST   /reviews                       Crear reseña
```

#### Stats (para dashboards)
```
GET    /stats/worker/:id              Earnings mes actual/anterior, jobs activos
GET    /stats/employer/:id            Jobs publicados, postulantes, contrataciones
```

#### Activity feed (employer dashboard)
```
GET    /activity?userId=              Feed de actividad reciente del employer
```

---

### 1.5 Estructura JSON esperada por cada pantalla

#### `GET /workers` (pantalla `/explorar`)
```json
[
  {
    "id": "uuid",
    "name": "Carlos Mendoza",
    "location": "Suba, Bogotá",
    "avatar": null,
    "workerProfile": {
      "category": "plomeria",
      "skills": ["Tuberías", "Grifería"],
      "hourlyRate": 35000,
      "rating": 4.8,
      "reviewCount": 47,
      "verified": true,
      "available": true
    }
  }
]
```

#### `GET /jobs/:id` (pantalla `/trabajos/[id]`)
```json
{
  "id": "uuid",
  "employerId": "uuid",
  "title": "Reparación de tubería",
  "description": "...",
  "category": "plomeria",
  "location": "Kennedy, Bogotá",
  "budget": { "min": 80000, "max": 150000 },
  "urgency": "urgent",
  "status": "open",
  "offerCount": 2,
  "acceptedOfferId": null,
  "images": [],
  "createdAt": "2026-05-10T14:30:00Z",
  "updatedAt": "2026-05-10T14:30:00Z",
  "employer": {
    "id": "uuid",
    "name": "Paula Ramírez",
    "location": "Kennedy, Bogotá",
    "employerProfile": {
      "companyName": null,
      "jobsPosted": 2,
      "verified": false
    }
  },
  "offers": [
    {
      "id": "uuid",
      "workerId": "uuid",
      "proposedPrice": 120000,
      "estimatedDuration": "2-3 horas",
      "message": "...",
      "status": "pending",
      "counterOfferPrice": null,
      "negotiationRound": 0,
      "worker": {
        "id": "uuid",
        "name": "Carlos Mendoza",
        "workerProfile": {
          "category": "plomeria",
          "rating": 4.8,
          "reviewCount": 47,
          "verified": true
        }
      }
    }
  ]
}
```

#### `POST /auth/login` (pantalla `/login`)
Request:
```json
{ "email": "carlos@gmail.com", "password": "contraseña" }
```
Response:
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "role": "worker",
    "name": "Carlos Mendoza",
    "email": "carlos@gmail.com",
    "location": "Suba, Bogotá",
    "workerProfile": { "..." : "..." }
  }
}
```

#### `GET /chats` + `GET /messages?chatId=` (pantalla `/mensajes/[chatId]`)
```json
// GET /chats
[
  {
    "id": "uuid",
    "jobId": "uuid",
    "offerId": "uuid",
    "participantIds": ["uuid-worker", "uuid-employer"],
    "lastMessage": "Perfecto. La dirección es...",
    "lastMessageAt": "2026-05-10T17:45:00Z",
    "unreadCount": { "uuid-worker": 1, "uuid-employer": 0 },
    "createdAt": "2026-05-10T16:05:00Z",
    "job": { "title": "Reparación de tubería" },
    "participants": [{ "id": "uuid", "name": "Carlos Mendoza", "avatar": null }]
  }
]

// GET /messages?chatId=uuid
[
  {
    "id": "uuid",
    "chatId": "uuid",
    "senderId": "uuid",
    "content": "Buenos días Paula...",
    "type": "text",
    "readBy": ["uuid-worker", "uuid-employer"],
    "createdAt": "2026-05-10T16:05:00Z"
  }
]
```

#### `GET /stats/worker/:id` (dashboard worker)
```json
{
  "earningsThisMonth": 340000,
  "earningsLastMonth": 304000,
  "earningsTrend": 12,
  "activeJobsCount": 1,
  "completedJobsCount": 52,
  "averagePerJob": 104000
}
```

#### `GET /activity?userId=` (dashboard employer)
```json
[
  {
    "id": "uuid",
    "type": "offer_negotiating",
    "text": "Andrés Vargas aceptó negociar precio — $170.000",
    "createdAt": "2026-05-09T11:30:00Z"
  }
]
```

---

### 1.6 Archivos del frontend que cambiar para consumir el backend

| Archivo | Cambio necesario |
|---------|-----------------|
| `src/context/AuthContext.tsx` | `login(userId)` → `POST /auth/login` + guardar JWT. Agregar `register()`. |
| `src/context/JobContext.tsx` | Reemplazar estado local+localStorage por hooks con fetch/axios hacia la API |
| `src/context/ChatContext.tsx` | Reemplazar estado local+localStorage por llamadas a `/chats`, `/messages` |
| `src/data/users.ts` | Eliminar. `getUserById()` → `GET /users/:id` |
| `src/data/jobs.ts` | Eliminar. Fuente de verdad → API |
| `src/data/offers.ts` | Eliminar. Fuente de verdad → API |
| `src/data/chats.ts` | Eliminar. Fuente de verdad → API |
| `src/data/messages.ts` | Eliminar. Fuente de verdad → API |
| `src/data/reviews.ts` | Eliminar. Fuente de verdad → API |
| `src/app/explorar/page.tsx` | `import { workers }` → `GET /workers?category=&q=` |
| `src/app/perfil/[id]/page.tsx` | `getUserById(id)` → `GET /users/:id` |
| `src/app/trabajos/[id]/page.tsx` | `getUserById()` → embebido en `GET /jobs/:id` |
| `src/app/dashboard/worker/page.tsx` | `WORKER_DEMO` + `activeJobs` hardcodeados → `GET /stats/worker/:id` + API real |
| `src/app/dashboard/employer/page.tsx` | `employer`, `applicants`, `activeHires`, `activityFeed` → API real |
| `src/components/features/auth/LoginForm.tsx` | Lógica de demo login → `POST /auth/login` |
| `src/components/features/auth/WorkerOnboarding.tsx` | → `POST /auth/register/worker` |
| `src/components/features/auth/ClientOnboarding.tsx` | → `POST /auth/register/employer` |

**Archivos que NO cambian** (estáticos):
- `src/data/categories.ts` — puede quedarse en frontend
- `src/data/copy.ts` — textos UI estáticos
- `src/data/landingContent.ts` — contenido estático
- Todo `src/components/ui/`, `src/components/layout/`, `src/components/brand/`

---

## 2. PLAN DE IMPLEMENTACIÓN NESTJS

### Estructura de módulos

```
backend/
├── src/
│   ├── auth/           # Módulo de autenticación
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   ├── users/          # Users + Worker/EmployerProfile
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   └── dto/
│   ├── jobs/
│   ├── offers/
│   ├── chats/
│   ├── messages/
│   ├── reviews/
│   ├── stats/
│   ├── activity/
│   └── app.module.ts
├── .env
└── package.json
```

---

### Task 1: Scaffold del proyecto NestJS

**Files:**
- Create: `backend/package.json`
- Create: `backend/src/app.module.ts`
- Create: `backend/.env.example`

- [ ] **Step 1: Crear proyecto**

```bash
cd /Users/ypuentes/Desktop/CamellioMVP
npx @nestjs/cli new backend --package-manager npm --skip-git
cd backend
npm install @nestjs/typeorm typeorm pg @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt class-validator class-transformer uuid
npm install -D @types/passport-jwt @types/bcrypt @types/uuid
```

- [ ] **Step 2: Crear archivo .env**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/camellio_dev
JWT_SECRET=camellio_dev_secret_change_in_production
JWT_EXPIRES_IN=7d
PORT=3001
```

- [ ] **Step 3: Configurar AppModule**

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // solo en dev
      }),
    }),
  ],
})
export class AppModule {}
```

- [ ] **Step 4: Arrancar y verificar conexión**

```bash
npm run start:dev
```
Expected: servidor en `http://localhost:3001` sin errores

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: scaffold NestJS backend with TypeORM + PostgreSQL"
```

---

### Task 2: Entidades TypeORM

**Files:**
- Create: `backend/src/users/entities/user.entity.ts`
- Create: `backend/src/users/entities/worker-profile.entity.ts`
- Create: `backend/src/users/entities/employer-profile.entity.ts`
- Create: `backend/src/jobs/entities/job.entity.ts`
- Create: `backend/src/offers/entities/offer.entity.ts`
- Create: `backend/src/chats/entities/chat.entity.ts`
- Create: `backend/src/messages/entities/message.entity.ts`
- Create: `backend/src/reviews/entities/review.entity.ts`

- [ ] **Step 1: Entidad User**

```typescript
// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { WorkerProfile } from './worker-profile.entity';
import { EmployerProfile } from './employer-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['worker', 'employer'] })
  role: 'worker' | 'employer';

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  location: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => WorkerProfile, (p) => p.user, { cascade: true, eager: true, nullable: true })
  workerProfile: WorkerProfile | null;

  @OneToOne(() => EmployerProfile, (p) => p.user, { cascade: true, eager: true, nullable: true })
  employerProfile: EmployerProfile | null;
}
```

- [ ] **Step 2: Entidad WorkerProfile**

```typescript
// src/users/entities/worker-profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('worker_profiles')
export class WorkerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (u) => u.workerProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  category: string;

  @Column('simple-array')
  skills: string[];

  @Column({ type: 'integer', default: 0 })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: 0 })
  completedJobs: number;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  available: boolean;

  @Column({ type: 'json', default: [] })
  portfolio: { id: string; imageUrl: string; caption?: string }[];
}
```

- [ ] **Step 3: Entidad EmployerProfile**

```typescript
// src/users/entities/employer-profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('employer_profiles')
export class EmployerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (u) => u.employerProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  companyName: string;

  @Column({ default: 0 })
  jobsPosted: number;

  @Column({ default: false })
  verified: boolean;
}
```

- [ ] **Step 4: Entidad Job**

```typescript
// src/jobs/entities/job.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'employerId' })
  employer: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column({ type: 'json' })
  budget: { min: number; max: number };

  @Column({ type: 'enum', enum: ['flexible', 'this_week', 'urgent'], default: 'flexible' })
  urgency: 'flexible' | 'this_week' | 'urgent';

  @Column({
    type: 'enum',
    enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled'],
    default: 'open',
  })
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ default: 0 })
  offerCount: number;

  @Column({ nullable: true })
  acceptedOfferId: string;

  @Column({ type: 'simple-array', default: '' })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 5: Entidades Offer, Chat, Message, Review** (mismo patrón de columnas que interfaces del frontend — ver sección 1.3)

- [ ] **Step 6: Verificar sync de tablas**

```bash
npm run start:dev
# psql: \dt
```
Expected: tablas `users`, `worker_profiles`, `employer_profiles`, `jobs`, `offers`, `chats`, `messages`, `reviews` creadas

- [ ] **Step 7: Commit**

```bash
git commit -m "feat: TypeORM entities for all domain models"
```

---

### Task 3: Módulo Auth

**Files:**
- Create: `backend/src/auth/auth.module.ts`
- Create: `backend/src/auth/auth.controller.ts`
- Create: `backend/src/auth/auth.service.ts`
- Create: `backend/src/auth/jwt.strategy.ts`
- Create: `backend/src/auth/dto/login.dto.ts`
- Create: `backend/src/auth/dto/register-worker.dto.ts`
- Create: `backend/src/auth/dto/register-employer.dto.ts`

- [ ] **Step 1: DTOs**

```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

```typescript
// src/auth/dto/register-worker.dto.ts
import { IsEmail, IsString, MinLength, IsNumber, IsArray } from 'class-validator';

export class RegisterWorkerDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() location: string;
  @IsString() category: string;
  @IsArray() skills: string[];
  @IsNumber() hourlyRate: number;
}
```

- [ ] **Step 2: AuthService**

```typescript
// src/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
      relations: ['workerProfile', 'employerProfile'],
    });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    const { passwordHash, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async registerWorker(dto: RegisterWorkerDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new ConflictException('Email ya registrado');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      role: 'worker',
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
      location: dto.location,
      workerProfile: { category: dto.category, skills: dto.skills, hourlyRate: dto.hourlyRate },
    });
    await this.usersRepo.save(user);
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    const { passwordHash: _, ...safeUser } = user;
    return { token, user: safeUser };
  }
}
```

- [ ] **Step 3: JwtStrategy**

```typescript
// src/auth/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; role: string }) {
    return { userId: payload.sub, role: payload.role };
  }
}
```

- [ ] **Step 4: Test con curl**

```bash
# Register worker
curl -X POST http://localhost:3001/auth/register/worker \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Worker","email":"test@test.com","password":"123456","location":"Suba, Bogotá","category":"plomeria","skills":["Tuberías"],"hourlyRate":35000}'
# Expected: { token: "...", user: { id, role: "worker", ... } }

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
# Expected: { token: "...", user: { id, role: "worker", ... } }
```

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: auth module with JWT, worker and employer registration"
```

---

### Task 4: Módulo Users (perfiles + lista workers)

**Endpoints:** `GET /workers`, `GET /users/:id`, `PUT /users/:id`

- [ ] **Step 1: UsersService.findWorkers()**

```typescript
async findWorkers(filters: { category?: string; q?: string }) {
  const qb = this.usersRepo.createQueryBuilder('u')
    .leftJoinAndSelect('u.workerProfile', 'wp')
    .where('u.role = :role', { role: 'worker' });

  if (filters.category) qb.andWhere('wp.category = :cat', { cat: filters.category });
  if (filters.q) {
    qb.andWhere('(LOWER(u.name) LIKE :q OR LOWER(u.location) LIKE :q)', {
      q: `%${filters.q.toLowerCase()}%`,
    });
  }

  const workers = await qb.orderBy('wp.rating', 'DESC').getMany();
  return workers.map(({ passwordHash, ...u }) => u);
}
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: users module with workers list and public profile"
```

---

### Task 5: Módulo Jobs

**Endpoints:** `GET /jobs`, `POST /jobs`, `GET /jobs/:id`, `PATCH /jobs/:id/status`

- [ ] **Step 1: JobsService.findAll()**

```typescript
async findAll(filters: { status?: string; category?: string; employerId?: string }) {
  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.category) where.category = filters.category;
  if (filters.employerId) where.employerId = filters.employerId;

  return this.jobsRepo.find({
    where,
    relations: ['employer', 'employer.employerProfile'],
    order: { createdAt: 'DESC' },
  });
}
```

- [ ] **Step 2: JobsService.findOne() con offers embebidas**

```typescript
async findOne(id: string) {
  const job = await this.jobsRepo.findOne({
    where: { id },
    relations: ['employer', 'employer.employerProfile'],
  });
  if (!job) throw new NotFoundException('Job not found');

  const offers = await this.offersRepo.find({
    where: { jobId: id },
    relations: ['worker', 'worker.workerProfile'],
  });

  return { ...job, offers };
}
```

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: jobs module with CRUD and status management"
```

---

### Task 6: Módulo Offers

**Endpoints:** `GET /offers`, `POST /offers`, `POST /offers/:id/accept|reject|withdraw|counter`

- [ ] **Step 1: OffersService.accept()**

```typescript
async accept(offerId: string, currentUserId: string) {
  const offer = await this.offersRepo.findOneOrFail({ where: { id: offerId } });
  if (offer.employerId !== currentUserId) throw new ForbiddenException();

  await this.offersRepo.update(
    { jobId: offer.jobId, id: Not(offerId) },
    { status: 'rejected' },
  );
  await this.offersRepo.update({ id: offerId }, { status: 'accepted' });
  await this.jobsRepo.update(
    { id: offer.jobId },
    { status: 'in_progress', acceptedOfferId: offerId },
  );

  return { success: true };
}
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: offers module with negotiation flow"
```

---

### Task 7: Módulo Chats + Messages

**Endpoints:** `GET /chats`, `GET /chats/:id`, `POST /chats`, `PATCH /chats/:id/read`, `GET /messages?chatId=`, `POST /messages`

- [ ] **Step 1: MessagesService.send() — actualiza chat.lastMessage**

```typescript
async send(dto: { chatId: string; senderId: string; content: string; type?: string }) {
  const msg = this.messagesRepo.create({
    ...dto,
    type: dto.type ?? 'text',
    readBy: [dto.senderId],
  });
  await this.messagesRepo.save(msg);

  const chat = await this.chatsRepo.findOneOrFail({ where: { id: dto.chatId } });
  const other = chat.participantIds.find((id) => id !== dto.senderId);
  await this.chatsRepo.update(dto.chatId, {
    lastMessage: dto.content,
    lastMessageAt: new Date(),
    unreadCount: { ...chat.unreadCount, [other]: (chat.unreadCount[other] ?? 0) + 1 },
  });

  return msg;
}
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: chats and messages modules"
```

---

### Task 8: Módulo Reviews

**Endpoints:** `GET /reviews`, `POST /reviews`

- [ ] **Step 1: ReviewsService.create() con recalculo de rating**

```typescript
async create(dto: CreateReviewDto, authorId: string) {
  const job = await this.jobsRepo.findOneOrFail({ where: { id: dto.jobId } });
  if (job.status !== 'completed') throw new BadRequestException('Job must be completed');

  const existing = await this.reviewsRepo.findOne({ where: { jobId: dto.jobId, authorId } });
  if (existing) throw new ConflictException('Ya dejaste una reseña para este trabajo');

  const review = this.reviewsRepo.create({ ...dto, authorId });
  await this.reviewsRepo.save(review);
  await this.recalculateWorkerRating(dto.targetId);
  return review;
}

private async recalculateWorkerRating(workerId: string) {
  const reviews = await this.reviewsRepo.find({ where: { targetId: workerId } });
  const count = reviews.length;
  const avg = count > 0
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
    : 0;
  await this.workerProfileRepo.update({ userId: workerId }, { rating: avg, reviewCount: count });
}
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: reviews module with automatic rating recalculation"
```

---

### Task 9: Módulo Stats + Activity feed

**Endpoints:** `GET /stats/worker/:id`, `GET /stats/employer/:id`, `GET /activity?userId=`

- [ ] **Step 1: StatsService.workerStats()**

```typescript
async workerStats(workerId: string) {
  const now = new Date();
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const completedOffers = await this.offersRepo.find({
    where: { workerId, status: 'accepted' },
    relations: ['job'],
  });

  const thisMonthEarnings = completedOffers
    .filter((o) => o.job?.status === 'completed' && new Date(o.updatedAt) >= startThisMonth)
    .reduce((s, o) => s + (o.counterOfferPrice ?? o.proposedPrice), 0);

  const lastMonthEarnings = completedOffers
    .filter((o) => {
      const d = new Date(o.updatedAt);
      return o.job?.status === 'completed' && d >= startLastMonth && d < startThisMonth;
    })
    .reduce((s, o) => s + (o.counterOfferPrice ?? o.proposedPrice), 0);

  return {
    earningsThisMonth: thisMonthEarnings,
    earningsLastMonth: lastMonthEarnings,
    earningsTrend: lastMonthEarnings > 0
      ? Math.round(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100)
      : 0,
    activeJobsCount: completedOffers.filter((o) => o.job?.status === 'in_progress').length,
  };
}
```

- [ ] **Step 2: ActivityService.getFeed() — derivado de jobs+offers, sin tabla propia**

Activity feed se construye en tiempo real: toma los últimos N eventos de jobs y offers del employer (ordenados por `updatedAt DESC`) y los transforma en texto. No requiere tabla `activity`.

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: stats and activity feed modules"
```

---

### Task 10: CORS + ValidationPipe global

- [ ] **Step 1: main.ts**

```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
```

- [ ] **Step 2: Verificar desde frontend que no hay errores CORS**

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: global validation pipe and CORS"
```

---

## 3. DEPENDENCIAS ENTRE TAREAS

```
Task 1 (Scaffold)
  → Task 2 (Entidades)
      → Task 3 (Auth)
      → Task 4 (Users)
          → Task 5 (Jobs)
              → Task 6 (Offers)
                  ├── Task 7 (Chats)      ← independientes entre sí
                  ├── Task 8 (Reviews)
                  └── Task 9 (Stats)
      → Task 10 (CORS)
```

Tasks 7, 8, 9 son independientes entre sí — se pueden hacer en paralelo tras Task 6.

---

## 4. NOTAS Y ADVERTENCIAS

1. **Chat en tiempo real**: REST con polling es suficiente para MVP. WebSockets/Socket.io es Phase 2.

2. **Subida de imágenes**: el frontend tiene UI de fotos pero es un placeholder. El backend acepta URLs pero no procesa uploads — eso requiere S3 o Cloudinary (Phase 2).

3. **Demo login sin contraseña**: el `LoginForm` actual no valida password, solo busca por email. Al migrar, sembrar usuarios de prueba con contraseñas hasheadas via seed script.

4. **Earnings stats**: la lógica asume que el precio pactado es `counterOfferPrice ?? proposedPrice`. Documentar esto para que no cambie silenciosamente.

5. **ActivityFeed**: se genera dinámicamente desde timestamps de jobs+offers. No necesita tabla propia.

6. **`passwordHash` nunca sale en responses**: usar siempre destructuring `{ passwordHash, ...safeUser }` antes de retornar. Considerar un `@Exclude()` global con `ClassSerializerInterceptor`.
