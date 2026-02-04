/**
 * Custom hook for managing task dependencies
 */

import { useState, useEffect } from 'react';
import { Dependency } from '@/lib/types';
import { dependencyStore } from '@/lib/store';

export function useDependencies() {
  const [dependencies, setDependencies] = useState<Dependency[]>([]);

  useEffect(() => {
    setDependencies(dependencyStore.getDependencies());
  }, []);

  const addDependency = (dependency: Dependency) => {
    dependencyStore.addDependency(dependency);
    setDependencies(dependencyStore.getDependencies());
  };

  const removeDependency = (id: string) => {
    dependencyStore.removeDependency(id);
    setDependencies(dependencyStore.getDependencies());
  };

  const getDependenciesForTask = (taskId: string): Dependency[] => {
    return dependencyStore.getDependenciesForTask(taskId);
  };

  return {
    dependencies,
    addDependency,
    removeDependency,
    getDependenciesForTask,
  };
}
