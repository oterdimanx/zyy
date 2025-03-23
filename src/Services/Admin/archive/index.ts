
import Cookies from "js-cookie";

export const get_all_archives = async () => {
  try {
    const res = await fetch('/api/common/archive/getArchive', {
      method: 'GET',
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in getting all Archives (service) =>', error)
  }
}

export const add_new_archive = async (formData: any) => {
  try {
      const res = await fetch(`/api/Admin/archive/add-archive`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('token')}`
          },
          body: JSON.stringify(formData),
      });
      const data = await res.json();
      return data;
  } catch (error) {
      console.log('Error in Add New Archive (service) =>', error);
  }
}

export const get_archive_by_id = async (id:string) => {
    try {
      const res = await fetch(`/api/common/archive/get-archive-by-id?id=${id}`, {
        method: 'GET',
      })
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.log('Error in getting Archives by ID (service) =>', error)
    }
  }

export const delete_an_archive = async (id:string) => {
  try {
    const res = await fetch(`/api/Admin/archive/delete-archive?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in deleting Archives (service) =>', error)
  }
}

export const update_an_archive = async (formData : any) => {
  try {
    const res = await fetch(`/api/Admin/archive/update-archive`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in updating Archives (service) =>', error)
  }
}

export const delete_an_image = async (id:string) => {
  try {
    const res = await fetch(`/api/Admin/image/delete-image?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in deleting Image (archive service) =>', error)
  }
}


