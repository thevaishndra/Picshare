export const userQuery = (userId) => {
    const query = `*[_type == "user" && _id == '${userId}']`;
    return query;
}

export const searchQuery = (search) => {
    const query = `*[_type == "pin" && title match '${search}*' || category match '${search}*' || about match '${search}*']{
      image {
        asset -> {
          url
        }
      },
      _id,
      destination,
      postedBy -> {
        _id,
        userName,
        image
      },
      save[]{
        _key,
        postedBy -> {
          _id,
          userName,
          image
        },
      },
    }`;
    return query;
}//adding asterisk means to search and match word even before completing it

export const feedQuery = `*[_type == 'pin'] | order(_createdAt desc){
image {
        asset -> {
          url
        }
      },
      _id,
      destination,
      postedBy -> {
        _id,
        userName,
        image
      },
      save[]{
        _key,
        postedBy -> {
          _id,
          userName,
          image
        },
      },
}` //newest post will be shown on top 