# Figma MCP Integration Setup

## Overview

This document provides instructions for setting up the Figma to Mobile Component Pipeline (MCP) integration. This allows for seamless synchronization between our Figma design system and the mobile application's components.

## Prerequisites

- Node.js and npm installed.
- Access to the project's Figma design file.

## Setup Steps

1.  **Install Dependencies**: If not already installed, run `npm install` in the project root.

2.  **Configure Environment Variables**:
    - Create a `.env` file in the project root by copying `.env.example`.
    - Obtain the Figma File ID and API Access Token from your Figma account.
        - The **File ID** is found in the Figma file's URL: `https://www.figma.com/file/{FILE_ID}/{FILE_NAME}`
        - The **API Access Token** can be generated from your Figma account settings.
    - Add the following to your `.env` file:

    ```
    FIGMA_FILE_ID=your_figma_file_id
    FIGMA_ACCESS_TOKEN=your_figma_access_token
    ```

3.  **Run the MCP Server (Optional but Recommended)**:
    - For real-time updates, you can run the MCP server locally.
    - `npm run mcp-server`

4.  **Sync Figma Components**:
    - To pull the latest design tokens and component definitions from Figma, run the following command:
    - `npm run sync-figma`

## Troubleshooting

- **Authentication Errors**: Ensure your `FIGMA_ACCESS_TOKEN` is correct and has the necessary permissions.
- **File Not Found**: Double-check the `FIGMA_FILE_ID`.
- **MCP Server Issues**: Make sure the port specified in your `.env` (if any) is not already in use.

