/**
 * Orchestrator Agent - Team Manager
 * 
 * Provides tooling to manage multi-agent deployments and team swaps.
 * 
 * Tools:
 *   - list_available_teams: List all available agent teams
 *   - deploy_team: Deploy or swap to a specific team
 *   - update_config: Update active team configuration
 *   - get_current_team: Get currently active team
 */

import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yaml from 'js-yaml';
import fs from 'fs/promises';

// Import skill functions
import {
    listAvailableTeams,
    deployTeam,
    updateActiveTeamConfig,
    getCurrentTeam
} from './skills/team_manager.mjs';

// Define available tools for the orchestrator LLM
export const tools = {
    list_available_teams: {
        description: 'List all available agent teams in the project. Use this to see what teams can be deployed.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        },
        execute: listAvailableTeams
    },
    
    deploy_team: {
        description: 'Deploy or swap to a specific agent team by name. This will execute just team <name> to run the specified team.',
        parameters: {
            type: 'object',
            properties: {
                teamName: {
                    type: 'string',
                    description: 'The exact directory name of the team to deploy (e.g., "test-agent", "validation-a", "brand").'
                }
            },
            required: ['teamName']
        },
        execute: deployTeam
    },
    
    update_config: {
        description: 'Update the multi-team-config.yaml to set a new active team. This routes the system to use the specified team.',
        parameters: {
            type: 'object',
            properties: {
                teamName: {
                    type: 'string',
                    description: 'The team name to set as active in the configuration.'
                }
            },
            required: ['teamName']
        },
        execute: updateActiveTeamConfig
    },
    
    get_current_team: {
        description: 'Get the currently active team from the configuration. Useful for debugging or reporting.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        },
        execute: getCurrentTeam
    }
};

// Default tool if tools aren't explicitly enabled
export const DEFAULT_TOOL = 'list_available_teams';
export const TOOLS = Object.keys(tools);

// Export individual tools for easy import
export default {
    listAvailableTeams,
    deployTeam,
    updateActiveTeamConfig,
    getCurrentTeam,
    tools,
    DEFAULT_TOOL,
    TOOLS
};
