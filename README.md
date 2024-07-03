# Spotify Playlist Generator

The Spotify Playlist Generator is a web application that allows users to create custom playlists based on their favorite artists and moods. The application leverages the Spotify Web API to search for artists, generate track recommendations, and save playlists directly to the user's Spotify account.

## Features

- **User Authentication**: Users can log in using their Spotify account.
- **Artist Search**: Users can search for their favorite artists.
- **Mood-Based Recommendations**: Users can select a mood to get track recommendations.
- **Playlist Creation**: Users can create and save playlists to their Spotify account.
- **Track Information**: Displays track details including name, album, artists, duration, and external Spotify link.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Arindam200/spotify-playlist-generator.git
    
    cd spotify-playlist-generator
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add your Spotify API credentials:
    ```env
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
    PORT=3000
    ```

4. **Run the application**:
    ```bash
    npm run dev
    ```

5. **Open your browser**:

    Navigate to `http://localhost:3000` to access the application.

## Usage

1. **Login**:
    - Click on the "Login" button to authenticate with your Spotify account.
      ![image](https://github.com/Arindam200/spotify-playlist-generator/assets/109217591/b1ac410c-9bf1-45ac-b965-56f7f7db96a3)


2. **Generate Playlist**:
    - Enter the name of your favorite artist and select a mood.
    - Click on "Generate Playlist" to get track recommendations.
      ![image](https://github.com/Arindam200/spotify-playlist-generator/assets/109217591/55c4a21b-8a04-444d-a78b-1635551923d4)


3. **Save Playlist**:
    - Enter a name for your new playlist.
    - Click on "Save Playlist to Spotify" to save the playlist to your Spotify account.

## License

This project is licensed under the ISC License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
