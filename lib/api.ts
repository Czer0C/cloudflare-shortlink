import { ApiResponse, Link } from './types';

const API_URL = '/api/links';

export async function getAllLinks(): Promise<Link[]> {
  try {
    const response = await fetch(`${API_URL}`);

    const links = await response.json();

    return links;
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
}

export async function getLink(code: string): Promise<Link | null> {
  try {
    const response = await fetch(`${API_URL}/${code}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch link');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching link with code ${code}:`, error);
    return null;
  }
}

export async function createLink(url: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to create link',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error creating link:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function updateLink(
  code: string,
  url: string,
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}?code=${code}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update link',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(`Error updating link with code ${code}:`, error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function deleteLink(code: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}?code=${code}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to delete link',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(`Error deleting link with code ${code}:`, error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}
