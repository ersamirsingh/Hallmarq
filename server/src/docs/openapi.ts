import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema
} from '../schemas/auth.schema.js';
import { adminCreateUserSchema } from '../schemas/user.schema.js';
import { createStoreSchema } from '../schemas/store.schema.js';
import { createCategorySchema } from '../schemas/category.schema.js';
import { submitRatingSchema } from '../schemas/rating.schema.js';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'token',
  description: 'HTTP-only JWT session cookie set automatically on login and register'
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Register a new user (Public)',
  description: 'Role: Public. Creates a new user with USER role, signs them in, and sends a verification email.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerSchema.shape.body
        }
      }
    }
  },
  responses: {
    201: { description: 'User registered and authenticated' },
    400: { description: 'Validation failed' },
    409: { description: 'Email already exists' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Log in with credentials (Public)',
  description: 'Role: Public. Authenticates user and sets session cookie. Locks account after 5 failed attempts.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginSchema.shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'Login successful' },
    401: { description: 'Email or password incorrect' },
    403: { description: 'Account locked' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/logout',
  tags: ['Auth'],
  summary: 'Log out current session (USER, OWNER, ADMIN)',
  description: 'Role: USER, OWNER, ADMIN. Clears authentication cookie.',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'Logged out successfully' },
    401: { description: 'Unauthorized' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/me',
  tags: ['Auth'],
  summary: 'Get current user session (USER, OWNER, ADMIN)',
  description: 'Role: USER, OWNER, ADMIN. Returns authenticated user details and email verification status.',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'Current user session' },
    401: { description: 'Unauthorized' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/verify-email',
  tags: ['Auth'],
  summary: 'Verify email address (Public)',
  description: 'Role: Public. Validates email verification token.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: verifyEmailSchema.shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'Email verified successfully' },
    400: { description: 'Invalid or expired token' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/resend-verification',
  tags: ['Auth'],
  summary: 'Resend verification email (USER, OWNER, ADMIN)',
  description: 'Role: USER, OWNER, ADMIN. Generates and sends a new verification link.',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'Verification email sent' },
    400: { description: 'Email already verified' },
    401: { description: 'Unauthorized' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/forgot-password',
  tags: ['Auth'],
  summary: 'Request password reset (Public)',
  description: 'Role: Public. Sends a reset link if account exists. Response is neutral to prevent user enumeration.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: forgotPasswordSchema.shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'Reset link sent if account exists' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/reset-password',
  tags: ['Auth'],
  summary: 'Reset password with token (Public)',
  description: 'Role: Public. Updates password, invalidates previous sessions, and clears account lockout.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: resetPasswordSchema.shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'Password reset successfully' },
    400: { description: 'Invalid or expired token' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/profile',
  tags: ['Profile'],
  summary: 'Get current user profile (USER, OWNER, ADMIN)',
  description: 'Role: USER, OWNER, ADMIN. Returns profile fields for the authenticated user.',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'Profile retrieved' },
    401: { description: 'Unauthorized' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/profile',
  tags: ['Profile'],
  summary: 'Update user profile (USER, OWNER, ADMIN)',
  description: 'Role: USER, OWNER, ADMIN. Updates name, email, and address. Unknown fields such as role are rejected.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateProfileSchema.shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'Profile updated' },
    400: { description: 'Validation failed' },
    401: { description: 'Unauthorized' },
    409: { description: 'Email already exists' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/profile/password',
  tags: ['Profile'],
  summary: 'Change user password (USER, OWNER, ADMIN)',
  description: 'Role: USER, OWNER, ADMIN. Bumps tokenVersion to invalidate other active sessions and issues fresh cookie.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: changePasswordSchema.shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'Password changed successfully' },
    400: { description: 'Incorrect current password or invalid new password' },
    401: { description: 'Unauthorized' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/categories',
  tags: ['Categories'],
  summary: 'List all categories (USER, OWNER, ADMIN)',
  description: 'Role: USER, OWNER, ADMIN. Returns alphabetical list of all store categories.',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'List of categories' },
    401: { description: 'Unauthorized' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/stores',
  tags: ['Stores'],
  summary: 'List and search stores (USER only)',
  description: 'Role: USER. Paginated store discovery with search, category filtering, and weighted rating sorting.',
  security: [{ cookieAuth: [] }],
  parameters: [
    { name: 'search', in: 'query', schema: { type: 'string' } },
    { name: 'categoryId', in: 'query', schema: { type: 'integer' } },
    { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['name', 'address', 'rating', 'top'] } },
    { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
  ],
  responses: {
    200: { description: 'Paginated list of stores' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires USER role' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/stores/{id}/rating',
  tags: ['Stores'],
  summary: 'Submit or update rating for a store (USER only)',
  description: 'Role: USER. Upserts rating from 1 to 5 stars with optional comment (up to 500 chars).',
  security: [{ cookieAuth: [] }],
  parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: submitRatingSchema.shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'Rating recorded' },
    400: { description: 'Validation failed' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden or email not verified' },
    404: { description: 'Store not found' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/stores/{id}/reviews',
  tags: ['Stores'],
  summary: 'Get store reviews (USER only)',
  description: 'Role: USER. Returns paginated written reviews for a store, newest first.',
  security: [{ cookieAuth: [] }],
  parameters: [
    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
  ],
  responses: {
    200: { description: 'Paginated reviews' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires USER role' },
    404: { description: 'Store not found' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/owner/dashboard',
  tags: ['Owner'],
  summary: 'Get store owner dashboard (OWNER only)',
  description: 'Role: OWNER. Returns store metrics, average rating, 5-star distribution, and paginated rater list.',
  security: [{ cookieAuth: [] }],
  parameters: [
    { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['name', 'value', 'ratedAt'] } },
    { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
  ],
  responses: {
    200: { description: 'Owner dashboard metrics' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires OWNER role' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/admin/stats',
  tags: ['Admin'],
  summary: 'Admin dashboard statistics (ADMIN only)',
  description: 'Role: ADMIN. Returns total user count, total store count, total ratings, and 14-day daily counts.',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'Admin statistics' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires ADMIN role' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/admin/users',
  tags: ['Admin'],
  summary: 'List users with filtering and sorting (ADMIN only)',
  description: 'Role: ADMIN. Paginated list of users filtered by name, email, address, or role.',
  security: [{ cookieAuth: [] }],
  parameters: [
    { name: 'name', in: 'query', schema: { type: 'string' } },
    { name: 'email', in: 'query', schema: { type: 'string' } },
    { name: 'address', in: 'query', schema: { type: 'string' } },
    { name: 'role', in: 'query', schema: { type: 'string', enum: ['ADMIN', 'USER', 'OWNER'] } },
    { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['name', 'email', 'address', 'role', 'createdAt'] } },
    { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
  ],
  responses: {
    200: { description: 'Paginated user list' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires ADMIN role' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/admin/users',
  tags: ['Admin'],
  summary: 'Create user with role (ADMIN only)',
  description: 'Role: ADMIN. Creates user with specified role and marks them verified.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: adminCreateUserSchema.shape.body
        }
      }
    }
  },
  responses: {
    201: { description: 'User created' },
    400: { description: 'Validation failed' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires ADMIN role' },
    409: { description: 'Email already exists' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/admin/users/{id}',
  tags: ['Admin'],
  summary: 'Get user details (ADMIN only)',
  description: 'Role: ADMIN. Returns user details, including store name and rating if role is OWNER.',
  security: [{ cookieAuth: [] }],
  parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
  responses: {
    200: { description: 'User details' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires ADMIN role' },
    404: { description: 'User not found' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/admin/stores',
  tags: ['Admin'],
  summary: 'List stores with filtering and sorting (ADMIN only)',
  description: 'Role: ADMIN. Paginated list of stores with category, owner, and ratings.',
  security: [{ cookieAuth: [] }],
  parameters: [
    { name: 'name', in: 'query', schema: { type: 'string' } },
    { name: 'email', in: 'query', schema: { type: 'string' } },
    { name: 'address', in: 'query', schema: { type: 'string' } },
    { name: 'categoryId', in: 'query', schema: { type: 'integer' } },
    { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['name', 'email', 'address', 'category', 'rating'] } },
    { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
  ],
  responses: {
    200: { description: 'Paginated store list' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires ADMIN role' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/admin/stores',
  tags: ['Admin'],
  summary: 'Create store (ADMIN only)',
  description: 'Role: ADMIN. Creates store with required category and optional unassigned OWNER.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createStoreSchema.shape.body
        }
      }
    }
  },
  responses: {
    201: { description: 'Store created' },
    400: { description: 'Validation failed or invalid owner/category' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires ADMIN role' },
    409: { description: 'Duplicate email or owner already has store' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/admin/owners/available',
  tags: ['Admin'],
  summary: 'List available owners without stores (ADMIN only)',
  description: 'Role: ADMIN. Returns OWNER users who do not currently own a store.',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'List of available owners' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires ADMIN role' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/admin/categories',
  tags: ['Categories'],
  summary: 'Create store category (ADMIN only)',
  description: 'Role: ADMIN. Creates a new store category and generates its slug.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createCategorySchema.shape.body
        }
      }
    }
  },
  responses: {
    201: { description: 'Category created' },
    400: { description: 'Validation failed' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: requires ADMIN role' },
    409: { description: 'Category name already exists' }
  }
});

export const getOpenApiDocumentation = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Hallmarq API',
      version: '1.0.0',
      description: 'OpenAPI specification for Hallmarq Store Rating Platform'
    },
    servers: [{ url: '/' }]
  });
};
